import { z } from 'zod'

export const invoiceSchema = z.object({
  customerName: z.string().trim().min(2, 'Customer name is required'),
  customerEmail: z.email('Enter a valid email'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date is required'),
  status: z.enum(['draft', 'sent', 'paid']),
})

export type InvoiceInput = z.infer<typeof invoiceSchema>
