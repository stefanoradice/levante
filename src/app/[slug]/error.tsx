'use client'

import { BackendError } from '@/components/ui/BackendError'

export default function PageError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <BackendError reset={reset} />
    </div>
  )
}
