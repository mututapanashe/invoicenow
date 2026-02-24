import Link from 'next/link'
import { AlertTriangle, CheckCircle2, CircleDollarSign, Clock3, Plus } from 'lucide-react'

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

const isOverdue = (invoice: Invoice) =>
  invoice.status !== 'paid' && new Date(invoice.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)

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
  const outstandingAmount = invoices
    .filter((invoice) => invoice.status !== 'paid')
    .reduce((total, invoice) => total + invoice.amount, 0)
  const paidThisMonth = invoices
    .filter((invoice) => invoice.status === 'paid' && isSameMonth(invoice.createdAt ?? invoice.dueDate, now))
    .reduce((total, invoice) => total + invoice.amount, 0)
  const totalBilled = invoices.reduce((total, invoice) => total + invoice.amount, 0)
  const overdueInvoices = invoices.filter(isOverdue)
  const dueSoonInvoices = invoices
    .filter((invoice) => invoice.status !== 'paid')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)
  const collectionRate = totalBilled > 0 ? (paidThisMonth / totalBilled) * 100 : 0

  const stats = [
    {
      label: 'Total invoices',
      value: String(totalInvoices),
      icon: CircleDollarSign,
      accent: 'text-blue-600',
    },
    {
      label: 'Outstanding balance',
      value: formatMoney(outstandingAmount, currencyCode),
      icon: Clock3,
      accent: 'text-amber-600',
    },
    {
      label: 'Collected this month',
      value: formatMoney(paidThisMonth, currencyCode),
      icon: CheckCircle2,
      accent: 'text-emerald-600',
    },
    {
      label: 'Collection rate',
      value: `${collectionRate.toFixed(1)}%`,
      icon: AlertTriangle,
      accent: 'text-sky-600',
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
        <Link
          href="/create-invoice"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-300/60 transition hover:from-blue-500 hover:to-cyan-400"
        >
          <Plus size={16} />
          New invoice
        </Link>
      </div>

      {pageError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <item.icon size={16} className={item.accent} /> {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Recent invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-sm text-slate-500">No invoices yet. Create your first invoice.</p>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 6).map((invoice) => {
                  const overdue = isOverdue(invoice)
                  return (
                    <div
                      key={invoice.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">{invoice.customerName}</p>
                        <p className="text-xs text-slate-500">Due {formatDate(invoice.dueDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {formatMoney(invoice.amount, currencyCode)}
                        </p>
                        <p
                          className={`text-xs uppercase tracking-wide ${overdue ? 'text-red-600' : 'text-slate-500'}`}
                        >
                          {overdue ? 'overdue' : invoice.status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>At-risk invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {overdueInvoices.length === 0 ? (
                <p className="text-sm text-slate-500">No overdue invoices. Great job on collections.</p>
              ) : (
                <div className="space-y-2">
                  {overdueInvoices.slice(0, 4).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2"
                    >
                      <p className="text-sm font-medium text-red-800">{invoice.customerName}</p>
                      <p className="text-xs text-red-700">{formatDate(invoice.dueDate)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming due dates</CardTitle>
            </CardHeader>
            <CardContent>
              {dueSoonInvoices.length === 0 ? (
                <p className="text-sm text-slate-500">No pending invoices due soon.</p>
              ) : (
                <ul className="space-y-2">
                  {dueSoonInvoices.map((invoice) => (
                    <li
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <span className="text-sm font-medium text-slate-700">{invoice.customerName}</span>
                      <span className="text-xs text-slate-500">{formatDate(invoice.dueDate)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
