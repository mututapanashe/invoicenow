import Link from 'next/link'
import { notFound } from 'next/navigation'

import { updateInvoiceAction } from '@/app/(dashboard)/invoices/actions'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { invoiceSelectFields, mapInvoiceRow, type InvoiceRow } from '@/lib/invoices'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

type EditInvoicePageProps = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    error?: string
  }>
}

export default async function EditInvoicePage({ params, searchParams }: EditInvoicePageProps) {
  const { id } = await params
  const { error } = await searchParams

  if (!hasSupabaseEnv()) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-amber-50">Edit Invoice</h1>
        <p className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          Supabase is not configured.
        </p>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: invoiceRow, error: invoiceError } = await supabase
    .from('invoices')
    .select(invoiceSelectFields)
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle<InvoiceRow>()

  if (invoiceError || !invoiceRow) {
    notFound()
  }

  const invoice = mapInvoiceRow(invoiceRow)
  const updateAction = updateInvoiceAction.bind(null, id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-amber-50">Edit Invoice</h1>
        <Link
          href={`/api/invoices/${id}/pdf`}
          className="inline-flex rounded-lg border border-orange-300/50 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200 hover:bg-orange-500/20"
        >
          Download PDF
        </Link>
      </div>

      <InvoiceForm mode="edit" defaultValues={invoice} action={updateAction} error={error} />
    </div>
  )
}
