import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const stats = [
  { label: 'Total invoices', value: '0' },
  { label: 'Pending amount', value: '$0.00' },
  { label: 'Paid this month', value: '$0.00' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/create-invoice"
          className="inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          New invoice
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
