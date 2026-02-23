import { Invoice } from '@/types'

export type InvoiceRow = {
  id: string
  customer_name: string
  customer_email: string
  amount: number | string
  due_date: string
  status: Invoice['status']
  created_at: string | null
}

export const invoiceSelectFields =
  'id, customer_name, customer_email, amount, due_date, status, created_at'

export const mapInvoiceRow = (row: InvoiceRow): Invoice => ({
  id: row.id,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  amount: typeof row.amount === 'number' ? row.amount : Number(row.amount),
  dueDate: row.due_date,
  status: row.status,
  createdAt: row.created_at ?? undefined,
})
