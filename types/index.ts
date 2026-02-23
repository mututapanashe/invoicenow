export type InvoiceStatus = 'draft' | 'sent' | 'paid'

export type Invoice = {
  id: string
  customerName: string
  customerEmail: string
  amount: number
  dueDate: string
  status: InvoiceStatus
  createdAt?: string
}

export type AccountSettings = {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  companyWebsite: string
  defaultCurrency: string
  paymentTermsDays: number
  invoicePrefix: string
}
