import { Button } from '@/components/ui/Buttons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
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
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Settings</h1>

      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {pageError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                <label htmlFor="companyName" className="text-sm font-medium text-slate-700">
                  Company name
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  defaultValue={settings.companyName}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="companyEmail" className="text-sm font-medium text-slate-700">
                  Company email
                </label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  defaultValue={settings.companyEmail}
                  placeholder="billing@company.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="companyPhone" className="text-sm font-medium text-slate-700">
                  Company phone
                </label>
                <Input
                  id="companyPhone"
                  name="companyPhone"
                  defaultValue={settings.companyPhone}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="companyWebsite" className="text-sm font-medium text-slate-700">
                  Company website
                </label>
                <Input
                  id="companyWebsite"
                  name="companyWebsite"
                  defaultValue={settings.companyWebsite}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="companyAddress" className="text-sm font-medium text-slate-700">
                Company address
              </label>
              <textarea
                id="companyAddress"
                name="companyAddress"
                rows={3}
                className="w-full rounded-lg border border-amber-200 bg-white/95 px-3 py-2 text-sm text-slate-900 placeholder:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/35"
                defaultValue={settings.companyAddress}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="defaultCurrency" className="text-sm font-medium text-slate-700">
                  Default currency
                </label>
                <Input
                  id="defaultCurrency"
                  name="defaultCurrency"
                  className="uppercase"
                  defaultValue={settings.defaultCurrency}
                  maxLength={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="paymentTermsDays" className="text-sm font-medium text-slate-700">
                  Payment terms (days)
                </label>
                <Input
                  id="paymentTermsDays"
                  name="paymentTermsDays"
                  type="number"
                  defaultValue={settings.paymentTermsDays}
                  min={1}
                  max={180}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="invoicePrefix" className="text-sm font-medium text-slate-700">
                  Invoice prefix
                </label>
                <Input
                  id="invoicePrefix"
                  name="invoicePrefix"
                  className="uppercase"
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
