import Link from 'next/link'

import { Button } from '@/components/ui/Buttons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

import { registerAction } from './actions'

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string
    message?: string
  }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const error = params.error
  const message = params.message

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={registerAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-amber-100">
              Full name
            </label>
            <Input id="fullName" name="fullName" placeholder="Jane Doe" />
          </div>

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

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-amber-100">
              Confirm password
            </label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
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
            Register
          </Button>
        </form>

        <p className="mt-4 text-sm text-amber-100/75">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-amber-200 hover:text-amber-100">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
