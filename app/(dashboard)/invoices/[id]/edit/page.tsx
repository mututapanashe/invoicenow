import { notFound } from 'next/navigation'

import { InvoiceForm } from '@/components/invoices/InvoiceForm'

type EditInvoicePageProps = {
  params: Promise<{
    id: string
  }>
}

const sampleInvoices = {
  '1': {
    id: '1',
    customerName: 'Acme Inc.',
    customerEmail: 'billing@acme.com',
    amount: 1200,
    dueDate: '2026-03-01',
    status: 'sent',
  },
  '2': {
    id: '2',
    customerName: 'Nova Labs',
    customerEmail: 'finance@novalabs.com',
    amount: 950,
    dueDate: '2026-03-07',
    status: 'draft',
  },
} as const

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { id } = await params
  const invoice = sampleInvoices[id as keyof typeof sampleInvoices]

  if (!invoice) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Invoice #{id}</h1>
      <InvoiceForm defaultValues={invoice} mode="edit" />
    </div>
  )
}
