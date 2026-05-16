'use client'

import { useRouter } from 'next/navigation'

import LogForm from '@/components/logs/LogForm'

export default function NewLogPage() {
  const router = useRouter()

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '48rem' }}>
        <h1 className="title is-2" style={{ marginBottom: '1.5rem' }}>
          Create Log
        </h1>
        <div className="box">
          <LogForm onSuccess={() => router.push('/logs')} onCancel={() => router.back()} />
        </div>
      </div>
    </div>
  )
}
