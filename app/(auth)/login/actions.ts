'use server'

import { redirect } from 'next/navigation'

import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

const encodeMessage = (message: string) => encodeURIComponent(message)

const sanitizePath = (pathname: string) =>
  pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/dashboard'

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()
  const next = sanitizePath(String(formData.get('next') ?? '/dashboard'))

  if (!email || !password) {
    redirect(`/login?error=${encodeMessage('Email and password are required.')}&next=${encodeURIComponent(next)}`)
  }

  if (!hasSupabaseEnv()) {
    redirect(
      `/login?error=${encodeMessage('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.')}&next=${encodeURIComponent(next)}`
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeMessage(error.message)}&next=${encodeURIComponent(next)}`)
  }

  redirect(next)
}
