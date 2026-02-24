'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

const encodeMessage = (message: string) => encodeURIComponent(message)

const getGoogleAuthErrorMessage = (errorMessage?: string) => {
  const normalized = errorMessage?.toLowerCase() ?? ''

  if (
    normalized.includes('unsupported provider') ||
    normalized.includes('provider is not enabled')
  ) {
    return 'Google sign-in is disabled. Enable Google under Supabase Authentication > Providers, then try again.'
  }

  return errorMessage ?? 'Unable to start Google sign-in.'
}

const sanitizePath = (pathname: string) =>
  pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/dashboard'

const getBaseUrl = async () => {
  const headerStore = await headers()
  const origin = headerStore.get('origin')
  if (origin) {
    return origin
  }

  const forwardedProto = headerStore.get('x-forwarded-proto')
  const forwardedHost = headerStore.get('x-forwarded-host')
  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  const host = headerStore.get('host')
  if (host) {
    return `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${host}`
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

export async function signInWithGoogleAction(formData: FormData) {
  const next = sanitizePath(String(formData.get('next') ?? '/dashboard'))

  if (!hasSupabaseEnv()) {
    redirect(
      `/login?error=${encodeMessage(
        'Authentication is temporarily unavailable. Please try again shortly.'
      )}`
    )
  }

  const supabase = await createClient()
  const baseUrl = await getBaseUrl()
  const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error || !data.url) {
    redirect(`/login?error=${encodeMessage(getGoogleAuthErrorMessage(error?.message))}`)
  }

  redirect(data.url)
}
