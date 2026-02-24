import Link from 'next/link'

import { formatMoney } from '@/lib/account-settings'
import { Invoice } from '@/types'

import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

type InvoiceTableProps = {
  invoices: Invoice[]
  currencyCode: string
}

const statusVariant = {
  draft: 'default',
  sent: 'warning',
  paid: 'success',
} as const

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))

const isOverdue = (invoice: Invoice) =>
  invoice.status !== 'paid' && new Date(invoice.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)

export function InvoiceTable({ invoices, currencyCode }: InvoiceTableProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {invoices.length === 0 ? (
          <p className="rounded-xl border border-amber-200 bg-white/90 px-4 py-3 text-sm text-amber-800">
            No invoices yet.
          </p>
        ) : (
          invoices.map((invoice) => {
            const overdue = isOverdue(invoice)
            return (
              <div
                key={invoice.id}
                className="rounded-xl border border-amber-200 bg-white/90 p-4 shadow-[0_14px_30px_-22px_rgba(161,98,7,0.55)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{invoice.customerName}</p>
                    <p className="truncate text-sm text-slate-500">{invoice.customerEmail}</p>
                  </div>
                  <Badge
                    variant={overdue ? 'warning' : statusVariant[invoice.status]}
                    className={overdue ? 'border-red-200 bg-red-50 text-red-700' : ''}
                  >
                    {overdue ? 'overdue' : invoice.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Due</p>
                    <p className="text-sm font-medium text-slate-700">{formatDate(invoice.dueDate)}</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatMoney(invoice.amount, currencyCode)}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Link
                    href={`/invoices/${invoice.id}/edit`}
                    className="text-sm font-semibold text-amber-800"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/api/invoices/${invoice.id}/pdf`}
                    className="text-sm font-semibold text-amber-700"
                  >
                    PDF
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-amber-200 bg-white/90 shadow-[0_14px_30px_-22px_rgba(161,98,7,0.55)] md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500">
                    No invoices yet.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => {
                  const overdue = isOverdue(invoice)
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-amber-950">{invoice.customerName}</TableCell>
                      <TableCell>{invoice.customerEmail}</TableCell>
                      <TableCell>{formatMoney(invoice.amount, currencyCode)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={overdue ? 'warning' : statusVariant[invoice.status]}
                          className={overdue ? 'border-red-200 bg-red-50 text-red-700' : ''}
                        >
                          {overdue ? 'overdue' : invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            href={`/invoices/${invoice.id}/edit`}
                            className="text-sm font-semibold text-amber-800 hover:text-amber-700"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/api/invoices/${invoice.id}/pdf`}
                            className="text-sm font-semibold text-amber-700 hover:text-amber-600"
                          >
                            PDF
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
