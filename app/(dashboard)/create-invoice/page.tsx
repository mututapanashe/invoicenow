import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import {
  DEFAULT_ACCOUNT_SETTINGS,
  mapAccountSettingsRow,
  type AccountSettingsRow,
  getDueDateFromTerms,
} from '@/lib/account-settings'
import { createInvoiceAction } from '@/app/(dashboard)/invoices/actions'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

type CreateInvoicePageProps = {
  searchParams: Promise<{
    error?: string
    message?: string
  }>
}

export default async function CreateInvoicePage({ searchParams }: CreateInvoicePageProps) {
  const params = await searchParams
  const error = params.error
  const message = params.message

  let paymentTermsDays = DEFAULT_ACCOUNT_SETTINGS.paymentTermsDays

  if (hasSupabaseEnv()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: settingsRow } = await supabase
        .from('account_settings')
        .select('payment_terms_days')
        .eq('user_id', user.id)
        .maybeSingle<Pick<AccountSettingsRow, 'payment_terms_days'>>()

      paymentTermsDays = mapAccountSettingsRow(settingsRow).paymentTermsDays
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Create Invoice</h1>
      <InvoiceForm
        mode="create"
        action={createInvoiceAction}
        error={error}
        message={message}
        defaultValues={{
          dueDate: getDueDateFromTerms(paymentTermsDays),
          status: 'draft',
        }}
      />
    </div>
  )
}
