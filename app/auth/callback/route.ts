import { NextResponse } from 'next/server'

import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

const sanitizePath = (pathname: string | null) =>
  pathname && pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/dashboard'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = sanitizePath(requestUrl.searchParams.get('next'))

  if (!hasSupabaseEnv()) {
    const redirectUrl = new URL('/login', requestUrl.origin)
    redirectUrl.searchParams.set('error', 'Supabase is not configured.')
    return NextResponse.redirect(redirectUrl)
  }

  if (!code) {
    const redirectUrl = new URL('/login', requestUrl.origin)
    redirectUrl.searchParams.set('error', 'Missing Google authorization code.')
    return NextResponse.redirect(redirectUrl)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const redirectUrl = new URL('/login', requestUrl.origin)
    redirectUrl.searchParams.set('error', error.message)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
