import { InvoiceForm } from '@/components/invoices/InvoiceForm'

export default function CreateInvoicePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
      <InvoiceForm mode="create" />
    </div>
  )
}
