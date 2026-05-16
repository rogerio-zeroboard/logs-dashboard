'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="level" style={{ padding: '0.75rem 1rem', borderTop: '1px solid #dbdbdb' }}>
      <div className="level-left">
        <span className="is-size-7" style={{ color: '#363636' }}>
          Page <span>{page.toLocaleString()}</span> of <span>{totalPages.toLocaleString()}</span>
        </span>
      </div>
      <div className="level-right">
        <div className="buttons has-addons">
          <button onClick={() => onPageChange(1)} disabled={page === 1} className="button is-small">
            <ChevronsLeft size={14} />
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="button is-small"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="button is-small"
          >
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="button is-small"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
