'use server'

import { redirect } from 'next/navigation'

import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

const encodeMessage = (message: string) => encodeURIComponent(message)

export async function registerAction(formData: FormData) {
  const fullName = String(formData.get('fullName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()
  const confirmPassword = String(formData.get('confirmPassword') ?? '').trim()

  if (!email || !password || !confirmPassword) {
    redirect(`/register?error=${encodeMessage('Email and password are required.')}`)
  }

  if (password !== confirmPassword) {
    redirect(`/register?error=${encodeMessage('Passwords do not match.')}`)
  }

  if (password.length < 6) {
    redirect(`/register?error=${encodeMessage('Password must be at least 6 characters.')}`)
  }

  if (!hasSupabaseEnv()) {
    redirect(
      `/register?error=${encodeMessage('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.')}`
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
    },
  })

  if (error) {
    redirect(`/register?error=${encodeMessage(error.message)}`)
  }

  if (!data.session) {
    const signInResult = await supabase.auth.signInWithPassword({ email, password })

    if (signInResult.error) {
      redirect(
        `/login?message=${encodeMessage(
          'Account created. Please verify your email if required, then sign in.'
        )}`
      )
    }
  }

  redirect('/dashboard')
}
