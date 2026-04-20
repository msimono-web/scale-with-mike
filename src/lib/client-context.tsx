'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { ClientSpace } from './types'

interface ClientContextValue {
  client: ClientSpace | null
}

const ClientContext = createContext<ClientContextValue>({ client: null })

export function useClient() {
  return useContext(ClientContext)
}

export function ClientSpaceProvider({
  client,
  children,
}: {
  client: ClientSpace | null
  children: ReactNode
}) {
  return (
    <ClientContext.Provider value={{ client }}>
      {children}
    </ClientContext.Provider>
  )
}
