'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Database } from 'lucide-react'

import Button from '@/components/ui/Button'
import IngestDataModal from './IngestDataModal'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/logs', label: 'Logs' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [showIngestModal, setShowIngestModal] = useState(false)

  return (
    <>
      <nav className="navbar is-white" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link
              href="/dashboard"
              className="navbar-item has-text-weight-bold is-size-4 has-text-primary"
            >
              ZeroBoard
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <Button variant="primary-outlined" onClick={() => setShowIngestModal(true)}>
                <Database size={16} style={{ marginRight: '0.5rem' }} />
                Ingest Sample Data
              </Button>
            </div>
            <div className="navbar-start">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navbar-item ${pathname.startsWith(item.href) ? 'is-active has-text-primary has-background-primary-light' : 'has-text-grey-dark'}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <IngestDataModal isOpen={showIngestModal} onClose={() => setShowIngestModal(false)} />
    </>
  )
}
