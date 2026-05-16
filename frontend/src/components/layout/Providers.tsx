'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import NavBar from '@/components/layout/NavBar'
import ToastContainer from '@/components/ui/Toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <main className="has-background-light" style={{ flex: 1 }}>
        {children}
      </main>
      <ToastContainer />
    </QueryClientProvider>
  )
}
