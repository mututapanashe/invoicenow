import Link from 'next/link'

import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { Invoice } from '@/types'

const sampleInvoices: Invoice[] = [
  {
    id: '1',
    customerName: 'Acme Inc.',
    customerEmail: 'billing@acme.com',
    amount: 1200,
    dueDate: '2026-03-01',
    status: 'sent',
  },
  {
    id: '2',
    customerName: 'Nova Labs',
    customerEmail: 'finance@novalabs.com',
    amount: 950,
    dueDate: '2026-03-07',
    status: 'draft',
  },
]

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <Link
          href="/create-invoice"
          className="inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create invoice
        </Link>
      </div>
      <InvoiceTable invoices={sampleInvoices} />
    </div>
  )
}
