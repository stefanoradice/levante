'use client'

import { BackendError } from '@/components/ui/BackendError'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ reset }: ErrorPageProps) {
  return <BackendError reset={reset} />
}
