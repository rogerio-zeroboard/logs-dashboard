'use client'

import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  loading,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title has-text-weight-semibold" style={{ color: '#363636' }}>
            {title}
          </p>
          <button className="delete" aria-label="close" onClick={onClose} />
        </header>
        <section className="modal-card-body" style={{ fontSize: '1.05rem' }}>
          {children}
        </section>
        <footer
          className="modal-card-foot"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          )}
        </footer>
      </div>
    </div>
  )
}
