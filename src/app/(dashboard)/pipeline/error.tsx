'use client'

export default function LeadsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">Erreur de chargement</h2>
      <p className="text-sm text-slate-500 mb-6 max-w-md">
        La page leads n&apos;a pas pu se charger. Vérifiez votre connexion internet et réessayez.
      </p>
      <p className="text-xs text-slate-400 mb-4 font-mono max-w-md truncate">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
  )
}
