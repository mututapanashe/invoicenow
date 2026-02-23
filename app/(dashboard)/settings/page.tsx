import { Button } from '@/components/ui/Buttons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  DEFAULT_ACCOUNT_SETTINGS,
  mapAccountSettingsRow,
  type AccountSettingsRow,
} from '@/lib/account-settings'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

import { saveSettingsAction } from './actions'

type SettingsPageProps = {
  searchParams: Promise<{
    message?: string
    error?: string
  }>
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams
  const message = params.message
  let pageError = params.error
  let settings = DEFAULT_ACCOUNT_SETTINGS

  if (hasSupabaseEnv()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase
        .from('account_settings')
        .select(
          'company_name, company_email, company_phone, company_address, company_website, default_currency, payment_terms_days, invoice_prefix'
        )
        .eq('user_id', user.id)
        .maybeSingle<AccountSettingsRow>()

      if (error) {
        pageError = error.message
      } else {
        settings = mapAccountSettingsRow(data)
      }
    }
  } else {
    pageError = pageError ?? 'Supabase is not configured.'
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-amber-50">Settings</h1>

      {message ? (
        <p className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}
      {pageError ? (
        <p className="rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {pageError}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveSettingsAction} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium text-amber-100">
                  Company name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  className="h-10 w-full rounded-md border border-amber-300/30 bg-neutral-900 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                  defaultValue={settings.companyName}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="companyEmail" className="text-sm font-medium text-amber-100">
                  Company email
                </label>
                <input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  className="h-10 w-full rounded-md border border-amber-300/30 bg-neutral-900 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                  defaultValue={settings.companyEmail}
                  placeholder="billing@company.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="companyPhone" className="text-sm font-medium text-amber-100">
                  Company phone
                </label>
                <input
                  id="companyPhone"
                  name="companyPhone"
                  className="h-10 w-full rounded-md border border-amber-300/30 bg-neutral-900 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                  defaultValue={settings.companyPhone}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="companyWebsite" className="text-sm font-medium text-amber-100">
                  Company website
                </label>
                <input
                  id="companyWebsite"
                  name="companyWebsite"
                  className="h-10 w-full rounded-md border border-amber-300/30 bg-neutral-900 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                  defaultValue={settings.companyWebsite}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="companyAddress" className="text-sm font-medium text-amber-100">
                Company address
              </label>
              <textarea
                id="companyAddress"
                name="companyAddress"
                rows={3}
                className="w-full rounded-md border border-amber-300/30 bg-neutral-900 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                defaultValue={settings.companyAddress}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="defaultCurrency" className="text-sm font-medium text-amber-100">
                  Default currency
                </label>
                <input
                  id="defaultCurrency"
                  name="defaultCurrency"
                  className="h-10 w-full rounded-md border border-amber-300/30 bg-neutral-900 px-3 py-2 text-sm uppercase text-amber-50 placeholder:text-amber-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                  defaultValue={settings.defaultCurrency}
                  maxLength={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="paymentTermsDays" className="text-sm font-medium text-amber-100">
                  Payment terms (days)
                </label>
                <input
                  id="paymentTermsDays"
                  name="paymentTermsDays"
                  type="number"
                  className="h-10 w-full rounded-md border border-amber-300/30 bg-neutral-900 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                  defaultValue={settings.paymentTermsDays}
                  min={1}
                  max={180}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="invoicePrefix" className="text-sm font-medium text-amber-100">
                  Invoice prefix
                </label>
                <input
                  id="invoicePrefix"
                  name="invoicePrefix"
                  className="h-10 w-full rounded-md border border-amber-300/30 bg-neutral-900 px-3 py-2 text-sm uppercase text-amber-50 placeholder:text-amber-200/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
                  defaultValue={settings.invoicePrefix}
                  maxLength={8}
                  required
                />
              </div>
            </div>

            <Button type="submit">Save settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
