'use server'

import { redirect } from 'next/navigation'
import { jwtLogin, fetchRegister } from '@/lib/api/wordpress/client'
import { setAuthToken, clearAuthToken } from './session'

export async function loginAction(
  _prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username e password sono obbligatori.' }
  }

  try {
    const { token } = await jwtLogin(username, password)
    await setAuthToken(token)
  } catch {
    return { error: 'Credenziali non valide. Riprova.' }
  }

  redirect('/dashboard')
}

export async function logoutAction(): Promise<void> {
  await clearAuthToken()
  redirect('/')
}

export async function registerAction(
  _prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!username || !email || !password) {
    return { error: 'Tutti i campi sono obbligatori.' }
  }

  try {
    await fetchRegister({ username, email, password })
    const { token } = await jwtLogin(username, password)
    await setAuthToken(token)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Registrazione fallita.' }
  }

  redirect('/dashboard')
}
