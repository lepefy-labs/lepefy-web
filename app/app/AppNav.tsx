'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const tabs = [
  { href: '/app/feed',   label: 'Feed',    icon: '⚡' },
  { href: '/app/saved',  label: 'Salvati', icon: '🔖' },
  { href: '/app/alerts', label: 'Alert',   icon: '🔔' },
  { href: '/app/market', label: 'Market',  icon: '📊' },
]

export default function AppNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="na-bottom-nav">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href)
        return (
          <a
            key={tab.href}
            href={tab.href}
            className={`na-nav-item${active ? ' na-nav-item-active' : ''}`}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span className="na-nav-label">{tab.label}</span>
          </a>
        )
      })}
      <button className="na-nav-item" onClick={handleLogout}>
        <span style={{ fontSize: 18 }}>👤</span>
        <span className="na-nav-label">Esci</span>
      </button>
    </nav>
  )
}
