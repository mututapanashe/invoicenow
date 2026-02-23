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

export function InvoiceTable({ invoices, currencyCode }: InvoiceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-amber-300/20 bg-neutral-950/90 shadow-xl shadow-black/30">
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
                <TableCell colSpan={6} className="text-center text-amber-100/70">
                  No invoices yet.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-amber-50">{invoice.customerName}</TableCell>
                  <TableCell>{invoice.customerEmail}</TableCell>
                  <TableCell>{formatMoney(invoice.amount, currencyCode)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={`/invoices/${invoice.id}/edit`}
                        className="text-sm font-semibold text-amber-300 hover:text-amber-200"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/api/invoices/${invoice.id}/pdf`}
                        className="text-sm font-semibold text-orange-300 hover:text-orange-200"
                      >
                        PDF
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
