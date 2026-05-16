'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import Button from '@/components/ui/Button'
import LogForm from '@/components/logs/LogForm'
import LogDetailView from '@/components/logs/LogDetailView'
import DeleteLogModal from '@/components/logs/DeleteLogModal'
import { toast } from '@/components/ui/Toast'
import { useLog, useDeleteLog } from '@/hooks/useLogs'

export default function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: log, isLoading } = useLog(id)
  const deleteLog = useDeleteLog()

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteLog.mutateAsync(id)
      toast('Log deleted successfully', 'success')
      router.push('/logs')
    } catch {
      toast('Failed to delete log', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <p className="has-text-grey">Loading...</p>
        </div>
      </div>
    )
  }

  if (!log) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <p className="has-text-grey" style={{ marginBottom: '1rem' }}>
            Log not found
          </p>
          <Button onClick={() => router.push('/logs')}>Back to Logs</Button>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: '48rem' }}>
          <button
            onClick={() => setIsEditing(false)}
            className="button is-ghost has-text-grey-dark"
          >
            <ArrowLeft size={16} style={{ marginRight: '0.25rem' }} />
            Back to details
          </button>
          <h1 className="title is-2" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            Edit Log
          </h1>
          <div className="box">
            <LogForm
              initialData={log}
              onSuccess={() => {
                setIsEditing(false)
                toast('Log updated successfully', 'success')
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <LogDetailView
        log={log}
        onEdit={() => setIsEditing(true)}
        onDelete={() => setShowDeleteModal(true)}
      />
      <DeleteLogModal
        log={log}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isPending={deleteLog.isPending}
      />
    </>
  )
}
