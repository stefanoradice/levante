import { cookies } from 'next/headers'
import { jwtValidate, fetchCurrentUser } from '@/lib/api/wordpress/client'

const TOKEN_COOKIE = 'wp_auth_token'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

export async function setAuthToken(token: string): Promise<void> {
  const store = await cookies()
  store.set(TOKEN_COOKIE, token, COOKIE_OPTIONS)
}

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(TOKEN_COOKIE)?.value ?? null
}

export async function clearAuthToken(): Promise<void> {
  const store = await cookies()
  store.delete(TOKEN_COOKIE)
}

export interface SessionUser {
  token: string
  id: number
  name: string
  email: string
  avatarUrl: string | null
}

export async function getValidatedSession(): Promise<SessionUser | null> {
  const token = await getAuthToken()
  if (!token) return null

  const isValid = await jwtValidate(token)
  if (!isValid) {
    await clearAuthToken()
    return null
  }

  try {
    const user = await fetchCurrentUser(token)
    return {
      token,
      id: user.id,
      name: user.name,
      email: (user as unknown as { email?: string }).email ?? '',
      avatarUrl: user.avatar_urls?.['96'] ?? null,
    }
  } catch {
    return { token, id: 0, name: '', email: '', avatarUrl: null }
  }
}
