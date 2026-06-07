'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const tabs = [
  { href: '/app/feed',   label: 'Feed',    icon: '⚡' },
  { href: '/app/saved',  label: 'Salvati', icon: '🔖' },
  { href: '/app/alerts', label: 'Alert',   icon: '🔔' },
  { href: '/app/market', label: 'Market',  icon: '📊' },
]

const navStyle: React.CSSProperties = {
  position: 'fixed',
  top: 'auto',
  bottom: 0,
  left: 0,
  right: 0,
  height: 70,
  background: '#0C0F1E',
  borderTop: '1px solid #1A1F38',
  display: 'flex',
  alignItems: 'stretch',
  zIndex: 100,
}

const itemStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  textDecoration: 'none',
  borderTop: '2px solid transparent',
  padding: '6px 0',
  background: 'none',
  border: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'none',
  cursor: 'pointer',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Courier New', Menlo, monospace",
  fontSize: 8,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

export default function AppNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav style={navStyle}>
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href)
        return (
          <a
            key={tab.href}
            href={tab.href}
            style={{
              ...itemStyle,
              borderTop: `2px solid ${active ? '#6B8AFF' : 'transparent'}`,
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ ...labelStyle, color: active ? '#6B8AFF' : '#373D60' }}>
              {tab.label}
            </span>
          </a>
        )
      })}
      <button style={{ ...itemStyle, borderTop: '2px solid transparent' }} onClick={handleLogout}>
        <span style={{ fontSize: 18 }}>👤</span>
        <span style={{ ...labelStyle, color: '#373D60' }}>Esci</span>
      </button>
    </nav>
  )
}
