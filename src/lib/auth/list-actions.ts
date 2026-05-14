'use server'

import { revalidatePath } from 'next/cache'
import { getAuthToken } from './session'
import { getUserDataRepository } from '@/lib/repositories/factory'

async function getTokenOrThrow(): Promise<string> {
  const token = await getAuthToken()
  if (!token) throw new Error('Non autenticato')
  return token
}

export async function createListAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    const token = await getTokenOrThrow()
    const name = formData.get('name') as string
    const isPublic = formData.get('isPublic') === 'true'
    if (!name?.trim()) return { error: 'Il nome è obbligatorio.' }
    await getUserDataRepository().createList(token, { name: name.trim(), isPublic })
    revalidatePath('/dashboard')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Errore.' }
  }
}

export async function deleteListAction(listId: string): Promise<{ error?: string }> {
  try {
    const token = await getTokenOrThrow()
    await getUserDataRepository().deleteList(token, listId)
    revalidatePath('/dashboard')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Errore.' }
  }
}

export async function updateListAction(
  listId: string,
  data: { name?: string; isPublic?: boolean },
): Promise<{ error?: string }> {
  try {
    const token = await getTokenOrThrow()
    await getUserDataRepository().updateList(token, listId, data)
    revalidatePath('/dashboard')
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Errore.' }
  }
}

export async function togglePostInListAction(
  listId: string,
  postId: number,
  add: boolean,
): Promise<{ error?: string }> {
  try {
    const token = await getTokenOrThrow()
    const repo = getUserDataRepository()
    if (add) {
      await repo.addToList(token, listId, postId)
    } else {
      await repo.removeFromList(token, listId, postId)
    }
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Errore.' }
  }
}
