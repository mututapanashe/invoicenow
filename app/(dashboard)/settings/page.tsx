import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Settings page coming soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}