export type InvoiceStatus = 'draft' | 'sent' | 'paid'

export type Invoice = {
  id: string
  customerName: string
  customerEmail: string
  amount: number
  dueDate: string
  status: InvoiceStatus
}
