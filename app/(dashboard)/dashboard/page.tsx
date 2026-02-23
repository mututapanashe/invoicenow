import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  DEFAULT_ACCOUNT_SETTINGS,
  formatMoney,
  mapAccountSettingsRow,
  type AccountSettingsRow,
} from '@/lib/account-settings'
import { invoiceSelectFields, mapInvoiceRow, type InvoiceRow } from '@/lib/invoices'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { Invoice } from '@/types'

const isSameMonth = (isoDate: string | undefined, target: Date) => {
  if (!isoDate) {
    return false
  }

  const value = new Date(isoDate)
  return value.getFullYear() === target.getFullYear() && value.getMonth() === target.getMonth()
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))

export default async function DashboardPage() {
  let invoices: Invoice[] = []
  let currencyCode = DEFAULT_ACCOUNT_SETTINGS.defaultCurrency
  let pageError: string | null = null

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
    pageError = 'Supabase is not configured.'
  }

  const now = new Date()
  const totalInvoices = invoices.length
  const pendingAmount = invoices
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((total, invoice) => total + invoice.amount, 0)
  const paidThisMonth = invoices
    .filter((invoice) => invoice.status === 'paid' && isSameMonth(invoice.createdAt ?? invoice.dueDate, now))
    .reduce((total, invoice) => total + invoice.amount, 0)

  const stats = [
    { label: 'Total invoices', value: String(totalInvoices) },
    { label: 'Pending amount', value: formatMoney(pendingAmount, currencyCode) },
    { label: 'Paid this month', value: formatMoney(paidThisMonth, currencyCode) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-amber-50">Dashboard</h1>
        <Link
          href="/create-invoice"
          className="inline-flex rounded-lg bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg shadow-orange-900/20 transition hover:brightness-105"
        >
          New invoice
        </Link>
      </div>

      {pageError ? (
        <p className="rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {pageError}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-amber-200/80">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-amber-50">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-amber-100/75">No invoices yet. Create your first invoice.</p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300/20 bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-amber-50">{invoice.customerName}</p>
                    <p className="text-xs text-amber-100/75">Due {formatDate(invoice.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-200">
                      {formatMoney(invoice.amount, currencyCode)}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-amber-200/75">{invoice.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
