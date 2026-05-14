'use client'

import { WifiOff, RefreshCw } from 'lucide-react'

interface BackendErrorProps {
  reset?: () => void
  inline?: boolean
}

export function BackendError({ reset, inline = false }: BackendErrorProps) {
  if (inline) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-foreground-muted">
        <WifiOff size={32} className="opacity-40" />
        <p className="text-sm">Contenuto non disponibile — backend non raggiungibile.</p>
        {reset && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover transition-colors"
          >
            <RefreshCw size={12} /> Riprova
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <WifiOff size={48} className="text-foreground-muted opacity-40" />
      <div className="space-y-2">
        <h2 className="font-display font-semibold text-xl text-foreground">
          Servizio temporaneamente non disponibile
        </h2>
        <p className="text-sm text-foreground-muted max-w-sm">
          Il backend WordPress non è raggiungibile. Controlla la connessione o riprova tra qualche minuto.
        </p>
      </div>
      {reset && (
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white
            text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          <RefreshCw size={14} /> Riprova
        </button>
      )}
    </div>
  )
}
