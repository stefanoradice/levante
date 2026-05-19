import type { User } from '@/types'

export interface AuthResult {
  token: string
  user: User
}

export interface IAuthProvider {
  login(username: string, password: string): Promise<AuthResult>
  register(username: string, email: string, password: string): Promise<AuthResult>
  validate(token: string): Promise<boolean>
  getCurrentUser(token: string): Promise<User>
}
