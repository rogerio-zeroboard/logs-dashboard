import Link from 'next/link'
import { Plus, Download } from 'lucide-react'

import Button from '@/components/ui/Button'

interface LogListHeaderProps {
  onExport: () => void
  isExporting?: boolean
}

export default function LogListHeader({ onExport, isExporting }: LogListHeaderProps) {
  return (
    <div className="level">
      <div className="level-left">
        <h1 className="title is-2">Logs</h1>
      </div>
      <div className="level-right">
        <div className="buttons">
          <Button variant="secondary" onClick={onExport} loading={isExporting}>
            <Download size={16} style={{ marginRight: '0.5rem' }} />
            Export CSV
          </Button>
          <Link href="/logs/new">
            <Button>
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Create Log
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
