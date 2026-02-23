import { Invoice } from '@/types'

import { Button } from '@/components/ui/Buttons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type InvoiceFormProps = {
  defaultValues?: Partial<Invoice>
  mode?: 'create' | 'edit'
}

export function InvoiceForm({ defaultValues, mode = 'create' }: InvoiceFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="customerName" className="text-sm font-medium text-gray-700">
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
            <label htmlFor="customerEmail" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                defaultValue={defaultValues?.amount}
                placeholder="1200"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
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
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <Select id="status" name="status" defaultValue={defaultValues?.status ?? 'draft'}>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </Select>
          </div>
          <Button type="submit">{mode === 'create' ? 'Save invoice' : 'Update invoice'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
