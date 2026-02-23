import { z } from 'zod'

export const settingsSchema = z.object({
  companyName: z.string().trim().min(2, 'Company name is required'),
  companyEmail: z
    .string()
    .trim()
    .email('Enter a valid company email')
    .or(z.literal('')),
  companyPhone: z.string().trim().max(40, 'Phone number is too long'),
  companyAddress: z.string().trim().max(200, 'Address is too long'),
  companyWebsite: z
    .string()
    .trim()
    .url('Website must be a valid URL')
    .or(z.literal('')),
  defaultCurrency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'Currency must be a 3-letter code'),
  paymentTermsDays: z.coerce
    .number()
    .int('Payment terms must be a whole number')
    .min(1, 'Payment terms must be at least 1 day')
    .max(180, 'Payment terms must be 180 days or fewer'),
  invoicePrefix: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, 'Invoice prefix is required')
    .max(8, 'Invoice prefix must be 8 characters or fewer')
    .regex(/^[A-Z0-9-]+$/, 'Invoice prefix can only use letters, numbers, and dashes'),
})

export type SettingsInput = z.infer<typeof settingsSchema>
