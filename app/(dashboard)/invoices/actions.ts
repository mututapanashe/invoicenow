'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { invoiceSchema } from '@/lib/validations/invoice'

const encodeMessage = (message: string) => encodeURIComponent(message)

const getInvoicePayload = (formData: FormData) => ({
  customerName: String(formData.get('customerName') ?? ''),
  customerEmail: String(formData.get('customerEmail') ?? ''),
  amount: String(formData.get('amount') ?? ''),
  dueDate: String(formData.get('dueDate') ?? ''),
  status: String(formData.get('status') ?? ''),
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

  const { error } = await auth.supabase.from('invoices').insert({
    user_id: auth.user.id,
    customer_name: parsed.data.customerName,
    customer_email: parsed.data.customerEmail,
    amount: parsed.data.amount,
    due_date: parsed.data.dueDate,
    status: parsed.data.status,
  })

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
