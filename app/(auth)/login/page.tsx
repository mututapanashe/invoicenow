import Link from 'next/link'

import { Button } from '@/components/ui/Buttons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

import { loginAction } from './actions'

type LoginPageProps = {
  searchParams: Promise<{
    error?: string
    message?: string
    next?: string
  }>
}

const sanitizePath = (pathname: string) =>
  pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/dashboard'

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const error = params.error
  const message = params.message
  const next = sanitizePath(params.next ?? '/dashboard')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Input id="password" name="password" type="password" required />
          </div>

          {message ? (
            <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
          ) : null}
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          No account yet?{' '}
          <Link href="/register" className="font-medium text-gray-900 hover:text-gray-700">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
