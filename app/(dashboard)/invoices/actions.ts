'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { invoiceSchema, type InvoiceInput } from '@/lib/validations/invoice'

const encodeMessage = (message: string) => encodeURIComponent(message)

const getInvoicePayload = (formData: FormData) => ({
  customerName: String(formData.get('customerName') ?? ''),
  customerEmail: String(formData.get('customerEmail') ?? ''),
  amount: String(formData.get('amount') ?? ''),
  dueDate: String(formData.get('dueDate') ?? ''),
  status: String(formData.get('status') ?? ''),
})

const isLegacyClientConstraintError = (message: string) => {
  const normalized = message.toLowerCase()

  return (
    normalized.includes('null value in column "client_name"') ||
    normalized.includes('null value in column "client_email"') ||
    (normalized.includes('client_name') && normalized.includes('not-null')) ||
    (normalized.includes('client_email') && normalized.includes('not-null'))
  )
}

const getInvoiceColumns = (input: InvoiceInput) => ({
  customer_name: input.customerName,
  customer_email: input.customerEmail,
  amount: input.amount,
  due_date: input.dueDate,
  status: input.status,
})

const ensureAuthenticatedUser = async () => {
  if (!hasSupabaseEnv()) {
    return { error: 'Supabase is not configured.' as const }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to manage invoices.' as const }
  }

  return { supabase, user }
}

export async function createInvoiceAction(formData: FormData) {
  const parsed = invoiceSchema.safeParse(getInvoicePayload(formData))

  if (!parsed.success) {
    redirect(`/create-invoice?error=${encodeMessage(parsed.error.issues[0]?.message ?? 'Invalid invoice data.')}`)
  }

  const auth = await ensureAuthenticatedUser()
  if ('error' in auth) {
    redirect(`/create-invoice?error=${encodeMessage(auth.error ?? 'Authentication failed.')}`)
  }

  const invoiceColumns = getInvoiceColumns(parsed.data)
  let { error } = await auth.supabase.from('invoices').insert({
    user_id: auth.user.id,
    ...invoiceColumns,
  })

  if (error && isLegacyClientConstraintError(error.message)) {
    const legacyRetryPayload: Record<string, unknown> = {
      user_id: auth.user.id,
      ...invoiceColumns,
      client_name: parsed.data.customerName,
      client_email: parsed.data.customerEmail,
    }
    const retryResult = await auth.supabase.from('invoices').insert(legacyRetryPayload)
    error = retryResult.error
  }

  if (error) {
    redirect(`/create-invoice?error=${encodeMessage(error.message)}`)
  }

  revalidatePath('/dashboard')
  revalidatePath('/invoices')
  redirect(`/invoices?message=${encodeMessage('Invoice saved successfully.')}`)
}

export async function updateInvoiceAction(invoiceId: string, formData: FormData) {
  const parsed = invoiceSchema.safeParse(getInvoicePayload(formData))

  if (!parsed.success) {
    redirect(
      `/invoices/${invoiceId}/edit?error=${encodeMessage(
        parsed.error.issues[0]?.message ?? 'Invalid invoice data.'
      )}`
    )
  }

  const auth = await ensureAuthenticatedUser()
  if ('error' in auth) {
    redirect(
      `/invoices/${invoiceId}/edit?error=${encodeMessage(auth.error ?? 'Authentication failed.')}`
    )
  }

  const { error } = await auth.supabase
    .from('invoices')
    .update({
      customer_name: parsed.data.customerName,
      customer_email: parsed.data.customerEmail,
      amount: parsed.data.amount,
      due_date: parsed.data.dueDate,
      status: parsed.data.status,
    })
    .eq('id', invoiceId)
    .eq('user_id', auth.user.id)

  if (error) {
    redirect(`/invoices/${invoiceId}/edit?error=${encodeMessage(error.message)}`)
  }

  revalidatePath('/dashboard')
  revalidatePath('/invoices')
  revalidatePath(`/invoices/${invoiceId}/edit`)
  redirect(`/invoices?message=${encodeMessage('Invoice updated successfully.')}`)
}
