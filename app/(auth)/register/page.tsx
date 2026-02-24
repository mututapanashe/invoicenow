import Link from 'next/link'

import { Button } from '@/components/ui/Buttons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

import { registerAction } from './actions'
import { signInWithGoogleAction } from '../oauth-actions'

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

  function GoogleIcon() {
    return (
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.221 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.958 3.042l5.657-5.657C34.058 6.053 29.294 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.153 7.958 3.042l5.657-5.657C34.058 6.053 29.294 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.192 0 9.878-1.977 13.402-5.192l-6.191-5.238C29.14 35.091 26.715 36 24 36c-5.2 0-9.626-3.331-11.284-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 01-4.092 5.569l.001-.001 6.191 5.238C37.001 39.108 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create account</CardTitle>
        <p className="text-sm text-amber-800">Start managing invoicing and cash flow in minutes.</p>
      </CardHeader>
      <CardContent>
        <form action={signInWithGoogleAction} className="mb-4">
          <input type="hidden" name="next" value="/dashboard" />
          <Button type="submit" variant="outline" className="w-full gap-2">
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>

        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-amber-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-amber-500">
            or register with email
          </span>
          <span className="h-px flex-1 bg-amber-200" />
        </div>

        <form action={registerAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
              Full name
            </label>
            <Input id="fullName" name="fullName" placeholder="Jane Doe" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Input id="password" name="password" type="password" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
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

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        <p className="mt-4 text-sm text-amber-900/80">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-amber-800 hover:text-amber-700">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
