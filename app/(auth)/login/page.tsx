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
            <label htmlFor="email" className="text-sm font-medium text-amber-100">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-amber-100">
              Password
            </label>
            <Input id="password" name="password" type="password" required />
          </div>

          {message ? (
            <p className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-red-400/50 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <p className="mt-4 text-sm text-amber-100/75">
          No account yet?{' '}
          <Link href="/register" className="font-medium text-amber-200 hover:text-amber-100">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
