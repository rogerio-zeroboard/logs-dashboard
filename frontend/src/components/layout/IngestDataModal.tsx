'use client'

import Modal from '@/components/ui/Modal'
import { toast } from '@/components/ui/Toast'
import { useIngestLogs } from '@/hooks/useLogs'

interface IngestDataModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function IngestDataModal({ isOpen, onClose }: IngestDataModalProps) {
  const ingestLogs = useIngestLogs()

  const handleIngest = async () => {
    try {
      await ingestLogs.mutateAsync()
      toast('Ingested 500 logs successfully', 'success')
      onClose()
    } catch {
      toast('Failed to ingest logs', 'error')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ingest Sample Data"
      confirmLabel="Ingest"
      onConfirm={handleIngest}
      loading={ingestLogs.isPending}
    >
      <p>This will generate ~500 sample logs across 30 days from a random source.</p>
      <p className="has-text-grey is-size-7" style={{ marginTop: '0.5rem' }}>
        Rate limited to 2 calls per minute.
      </p>
    </Modal>
  )
}
