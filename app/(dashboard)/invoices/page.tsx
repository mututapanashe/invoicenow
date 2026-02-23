import Link from 'next/link'

import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import {
  DEFAULT_ACCOUNT_SETTINGS,
  mapAccountSettingsRow,
  type AccountSettingsRow,
} from '@/lib/account-settings'
import { invoiceSelectFields, mapInvoiceRow, type InvoiceRow } from '@/lib/invoices'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { Invoice } from '@/types'

type InvoicesPageProps = {
  searchParams: Promise<{
    message?: string
    error?: string
  }>
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const params = await searchParams
  const message = params.message
  let pageError = params.error
  let currencyCode = DEFAULT_ACCOUNT_SETTINGS.defaultCurrency
  let invoices: Invoice[] = []

  if (hasSupabaseEnv()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const [invoiceResult, settingsResult] = await Promise.all([
        supabase
          .from('invoices')
          .select(invoiceSelectFields)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .returns<InvoiceRow[]>(),
        supabase
          .from('account_settings')
          .select('default_currency')
          .eq('user_id', user.id)
          .maybeSingle<Pick<AccountSettingsRow, 'default_currency'>>(),
      ])

      if (invoiceResult.error) {
        pageError = invoiceResult.error.message
      } else {
        invoices = (invoiceResult.data ?? []).map(mapInvoiceRow)
      }

      if (settingsResult.data) {
        currencyCode = mapAccountSettingsRow(settingsResult.data).defaultCurrency
      }
    }
  } else {
    pageError = pageError ?? 'Supabase is not configured.'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-amber-50">Invoices</h1>
        <Link
          href="/create-invoice"
          className="inline-flex rounded-lg bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-orange-900/20 transition hover:brightness-105"
        >
          Create invoice
        </Link>
      </div>

      {message ? (
        <p className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}
      {pageError ? (
        <p className="rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {pageError}
        </p>
      ) : null}

      <InvoiceTable invoices={invoices} currencyCode={currencyCode} />
    </div>
  )
}
