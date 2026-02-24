import { Invoice } from '@/types'

import { Button } from '@/components/ui/Buttons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type InvoiceFormProps = {
  defaultValues?: Partial<Invoice>
  mode?: 'create' | 'edit'
  action: (formData: FormData) => void | Promise<void>
  error?: string
  message?: string
}

export function InvoiceForm({
  defaultValues,
  mode = 'create',
  action,
  error,
  message,
}: InvoiceFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="customerName" className="text-sm font-medium text-slate-700">
              Customer name
            </label>
            <Input
              id="customerName"
              name="customerName"
              defaultValue={defaultValues?.customerName}
              placeholder="Acme Inc."
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="customerEmail" className="text-sm font-medium text-slate-700">
              Customer email
            </label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              defaultValue={defaultValues?.customerEmail}
              placeholder="billing@acme.com"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-slate-700">
                Amount
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="1"
                defaultValue={defaultValues?.amount}
                placeholder="1200"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium text-slate-700">
                Due date
              </label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={defaultValues?.dueDate}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-slate-700">
              Status
            </label>
            <Select id="status" name="status" defaultValue={defaultValues?.status ?? 'draft'}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </Select>
          </div>

          {message ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button type="submit">{mode === 'create' ? 'Save invoice' : 'Update invoice'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
