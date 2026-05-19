import type { IAuthProvider } from './interfaces'
import { WordPressAuthProvider } from './wordpress/WordPressAuthProvider'

export function getAuthProvider(): IAuthProvider {
  return new WordPressAuthProvider()
}
