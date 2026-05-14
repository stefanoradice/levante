import { redirect } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { LogOut, User } from 'lucide-react'
import { getValidatedSession } from '@/lib/auth/session'
import { getUserDataRepository } from '@/lib/repositories/factory'
import { logoutAction } from '@/lib/auth/actions'
import { ListCard } from '@/components/dashboard/ListCard'
import { CreateListForm } from '@/components/dashboard/CreateListForm'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const session = await getValidatedSession()
  if (!session) redirect('/login')

  const lists = await getUserDataRepository().getLists(session.token).catch(() => [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile */}
      <div className="flex items-center gap-5 p-6 rounded-xl border border-card-border bg-card mb-10">
        {session.avatarUrl ? (
          <Image src={session.avatarUrl} alt={session.name} width={64} height={64} className="rounded-full" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <User size={28} className="text-accent" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-lg text-foreground truncate">{session.name || 'Utente'}</p>
          {session.email && <p className="text-sm text-foreground-muted truncate">{session.email}</p>}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium
              text-foreground-muted border border-border rounded-lg
              hover:text-foreground hover:border-foreground-muted transition-colors"
          >
            <LogOut size={14} /> Esci
          </button>
        </form>
      </div>

      {/* Lists */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl text-foreground">Le mie liste</h2>
        <CreateListForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lists.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
      </div>
    </div>
  )
}
