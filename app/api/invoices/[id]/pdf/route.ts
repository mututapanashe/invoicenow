import { NextResponse } from 'next/server'

import {
  DEFAULT_ACCOUNT_SETTINGS,
  type AccountSettingsRow,
  mapAccountSettingsRow,
} from '@/lib/account-settings'
import { invoiceSelectFields, mapInvoiceRow, type InvoiceRow } from '@/lib/invoices'
import { buildInvoicePdf } from '@/lib/pdf/invoice'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

type Context = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, { params }: Context) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
  }

  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: invoiceRow, error: invoiceError } = await supabase
    .from('invoices')
    .select(invoiceSelectFields)
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle<InvoiceRow>()

  if (invoiceError) {
    return NextResponse.json({ error: invoiceError.message }, { status: 500 })
  }

  if (!invoiceRow) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
  }

  const { data: settingsRow } = await supabase
    .from('account_settings')
    .select(
      'company_name, company_email, company_phone, company_address, company_website, default_currency, payment_terms_days, invoice_prefix'
    )
    .eq('user_id', user.id)
    .maybeSingle<AccountSettingsRow>()

  const invoice = mapInvoiceRow(invoiceRow)
  const settings = settingsRow ? mapAccountSettingsRow(settingsRow) : DEFAULT_ACCOUNT_SETTINGS
  const pdfBytes = buildInvoicePdf({ invoice, settings })

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoice.id}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
