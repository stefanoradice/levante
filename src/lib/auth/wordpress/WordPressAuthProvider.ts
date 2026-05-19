import type { IAuthProvider, AuthResult } from '../interfaces'
import type { User } from '@/types'
import {
  jwtLogin,
  jwtValidate,
  fetchCurrentUser,
  fetchRegister,
} from '@/lib/api/wordpress/client'

export class WordPressAuthProvider implements IAuthProvider {
  async login(username: string, password: string): Promise<AuthResult> {
    const { token } = await jwtLogin(username, password)
    const user = await this.getCurrentUser(token)
    return { token, user }
  }

  async register(username: string, email: string, password: string): Promise<AuthResult> {
    await fetchRegister({ username, email, password })
    return this.login(username, password)
  }

  async validate(token: string): Promise<boolean> {
    return jwtValidate(token)
  }

  async getCurrentUser(token: string): Promise<User> {
    const raw = await fetchCurrentUser(token)
    return {
      id: raw.id,
      name: raw.name,
      email: (raw as unknown as { email?: string }).email ?? '',
      avatarUrl: raw.avatar_urls?.['96'] ?? null,
    }
  }
}
