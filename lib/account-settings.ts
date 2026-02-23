import { AccountSettings } from '@/types'

export type AccountSettingsRow = {
  company_name: string | null
  company_email: string | null
  company_phone: string | null
  company_address: string | null
  company_website: string | null
  default_currency: string | null
  payment_terms_days: number | null
  invoice_prefix: string | null
}

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  companyName: 'Panatech Invoice',
  companyEmail: '',
  companyPhone: '',
  companyAddress: '',
  companyWebsite: '',
  defaultCurrency: 'USD',
  paymentTermsDays: 14,
  invoicePrefix: 'INV',
}

const trimOrEmpty = (value: string | null | undefined) => value?.trim() ?? ''

export const mapAccountSettingsRow = (
  row: Partial<AccountSettingsRow> | null | undefined
): AccountSettings => {
  if (!row) {
    return DEFAULT_ACCOUNT_SETTINGS
  }

  return {
    companyName: trimOrEmpty(row.company_name) || DEFAULT_ACCOUNT_SETTINGS.companyName,
    companyEmail: trimOrEmpty(row.company_email),
    companyPhone: trimOrEmpty(row.company_phone),
    companyAddress: trimOrEmpty(row.company_address),
    companyWebsite: trimOrEmpty(row.company_website),
    defaultCurrency: trimOrEmpty(row.default_currency).toUpperCase() || 'USD',
    paymentTermsDays:
      typeof row.payment_terms_days === 'number' && row.payment_terms_days > 0
        ? row.payment_terms_days
        : DEFAULT_ACCOUNT_SETTINGS.paymentTermsDays,
    invoicePrefix: trimOrEmpty(row.invoice_prefix).toUpperCase() || 'INV',
  }
}

export const getDueDateFromTerms = (paymentTermsDays: number) => {
  const today = new Date()
  const dueDate = new Date(today)
  dueDate.setDate(today.getDate() + paymentTermsDays)
  return dueDate.toISOString().slice(0, 10)
}

export const formatMoney = (amount: number, currencyCode: string) => {
  const safeCurrency = /^[A-Z]{3}$/.test(currencyCode) ? currencyCode : 'USD'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: safeCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
