'use client'

import { BackendError } from '@/components/ui/BackendError'

export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <BackendError reset={reset} />
    </div>
  )
}
