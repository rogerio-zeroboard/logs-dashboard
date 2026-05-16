'use client'

import Modal from '@/components/ui/Modal'
import { Log } from '@/lib/types'
import { formatTimestamp } from '@/lib/utils'

interface DeleteLogModalProps {
  log: Log
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export default function DeleteLogModal({
  log,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteLogModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete log?"
      confirmLabel="Delete"
      confirmVariant="danger"
      onConfirm={onConfirm}
      loading={isPending}
    >
      <p>This will permanently delete the log from {formatTimestamp(log.timestamp)}.</p>
      <p className="has-text-grey is-size-7" style={{ marginTop: '0.5rem' }}>
        This action cannot be undone.
      </p>
    </Modal>
  )
}
