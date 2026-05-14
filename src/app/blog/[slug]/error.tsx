'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BackendError } from '@/components/ui/BackendError'

export default function PostError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-muted
          hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Torna al blog
      </Link>
      <BackendError reset={reset} />
    </div>
  )
}
