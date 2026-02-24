import Link from 'next/link'
import { Search } from 'lucide-react'

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
    status?: string
    q?: string
  }>
}

const isOverdue = (invoice: Invoice) =>
  invoice.status !== 'paid' && new Date(invoice.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)

const filterByStatus = (invoice: Invoice, status: string) => {
  if (status === 'all') {
    return true
  }
  if (status === 'overdue') {
    return isOverdue(invoice)
  }
  return invoice.status === status
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const params = await searchParams
  const message = params.message
  let pageError = params.error
  const requestedStatus = String(params.status ?? 'all')
  const statusFilter = ['all', 'draft', 'sent', 'paid', 'overdue'].includes(requestedStatus)
    ? requestedStatus
    : 'all'
  const query = String(params.q ?? '').trim().toLowerCase()
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

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus = filterByStatus(invoice, statusFilter)
    if (!matchesStatus) {
      return false
    }

    if (!query) {
      return true
    }

    return (
      invoice.customerName.toLowerCase().includes(query) ||
      invoice.customerEmail.toLowerCase().includes(query)
    )
  })

  const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Invoices</h1>
        <Link
          href="/create-invoice"
          className="inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-300/60 transition hover:from-blue-500 hover:to-cyan-400"
        >
          Create invoice
        </Link>
      </div>

      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {pageError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 sm:p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_200px_auto]">
          <label className="relative block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="q"
              defaultValue={params.q ?? ''}
              placeholder="Search by customer or email"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35"
            />
          </label>
          <select
            name="status"
            defaultValue={statusFilter}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-semibold text-white hover:from-blue-500 hover:to-cyan-400"
          >
            Apply
          </button>
        </form>
      </div>

      <InvoiceTable invoices={filteredInvoices} currencyCode={currencyCode} />
    </div>
  )
}
