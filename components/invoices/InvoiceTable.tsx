import Link from 'next/link'

import { Invoice } from '@/types'

import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

type InvoiceTableProps = {
  invoices: Invoice[]
}

const statusVariant = {
  draft: 'default',
  sent: 'warning',
  paid: 'success',
} as const

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
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
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No invoices yet.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-gray-900">{invoice.customerName}</TableCell>
                  <TableCell>{invoice.customerEmail}</TableCell>
                  <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/invoices/${invoice.id}/edit`}
                      className="text-sm font-medium text-gray-900 hover:text-gray-700"
                    >
                      Edit
                    </Link>
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
