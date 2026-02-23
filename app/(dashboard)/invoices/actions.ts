'use server'

import { invoiceSchema } from '@/lib/validations/invoice'

type InvoiceActionState = {
  error?: string
  success?: boolean
}

export async function saveInvoiceAction(
  _prevState: InvoiceActionState,
  formData: FormData
): Promise<InvoiceActionState> {
  const values = {
    customerName: formData.get('customerName'),
    customerEmail: formData.get('customerEmail'),
    amount: formData.get('amount'),
    dueDate: formData.get('dueDate'),
    status: formData.get('status'),
  }

  const parsed = invoiceSchema.safeParse(values)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid invoice data.' }
  }

  // Persist to DB in a follow-up change.
  return { success: true }
}
