'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { settingsSchema } from '@/lib/validations/settings'

const encodeMessage = (message: string) => encodeURIComponent(message)

export async function saveSettingsAction(formData: FormData) {
  const parsed = settingsSchema.safeParse({
    companyName: formData.get('companyName'),
    companyEmail: formData.get('companyEmail'),
    companyPhone: formData.get('companyPhone'),
    companyAddress: formData.get('companyAddress'),
    companyWebsite: formData.get('companyWebsite'),
    defaultCurrency: formData.get('defaultCurrency'),
    paymentTermsDays: formData.get('paymentTermsDays'),
    invoicePrefix: formData.get('invoicePrefix'),
  })

  if (!parsed.success) {
    redirect(`/settings?error=${encodeMessage(parsed.error.issues[0]?.message ?? 'Invalid settings data.')}`)
  }

  if (!hasSupabaseEnv()) {
    redirect(`/settings?error=${encodeMessage('Supabase is not configured.')}`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/settings?error=${encodeMessage('You must be logged in to update settings.')}`)
  }

  const { error } = await supabase.from('account_settings').upsert(
    {
      user_id: user.id,
      company_name: parsed.data.companyName,
      company_email: parsed.data.companyEmail || null,
      company_phone: parsed.data.companyPhone || null,
      company_address: parsed.data.companyAddress || null,
      company_website: parsed.data.companyWebsite || null,
      default_currency: parsed.data.defaultCurrency,
      payment_terms_days: parsed.data.paymentTermsDays,
      invoice_prefix: parsed.data.invoicePrefix,
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    redirect(`/settings?error=${encodeMessage(error.message)}`)
  }

  revalidatePath('/dashboard')
  revalidatePath('/invoices')
  revalidatePath('/create-invoice')
  revalidatePath('/settings')
  redirect(`/settings?message=${encodeMessage('Settings saved successfully.')}`)
}
