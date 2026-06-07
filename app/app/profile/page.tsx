'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const BACKEND = 'https://lepefy-backend-production.up.railway.app'
const SUPABASE_URL = 'https://osonphsavryefwmlhkyv.supabase.co'

interface Subscription {
  keyword: string
  min_threshold: number
  max_threshold: number
  active: boolean
  is_collector: boolean
  include_defective: boolean
  source: string | null
  plan: string
}

interface ProfileData {
  subscriptions: Subscription[]
}

interface KeywordSuggestion {
  keyword: string
}

function PlanBadge({ plan }: { plan: string }) {
  const upper = plan.toUpperCase()
  const color =
    upper === 'PRO' ? '#00E87A' :
    upper === 'BETA' ? '#6B8AFF' :
    '#7B84B0'
  const bg =
    upper === 'PRO' ? '#002A18' :
    upper === 'BETA' ? '#0F1535' :
    '#1A1F38'
  return (
    <span
      className="na-tag"
      style={{ color, background: bg, border: `1px solid ${color}`, fontSize: 9 }}
    >
      {upper}
    </span>
  )
}

function SourceBadge({ source }: { source: string | null }) {
  const label = source ?? 'Tutti'
  const lower = (source ?? '').toLowerCase()
  const cls =
    lower === 'subito' ? 'na-tag na-tag-subito' :
    lower === 'vinted' ? 'na-tag na-tag-vinted' :
    'na-tag na-tag-indigo'
  return <span className={cls}>{label}</span>
}

export default function ProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('FREE')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [anonKey, setAnonKey] = useState('')

  // keyword search
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // toggle / delete loading states
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const jwt = session.access_token
      const userEmail = session.user.email ?? ''
      setEmail(userEmail)
      setToken(jwt)
      setAnonKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')

      try {
        const res = await fetch(`${BACKEND}/app/profile`, {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        if (!res.ok) throw new Error(`Errore ${res.status}`)
        const data: ProfileData = await res.json()
        setSubscriptions(data.subscriptions)
        const plans = data.subscriptions.map((s) => s.plan)
        if (plans.includes('PRO')) setPlan('PRO')
        else if (plans.includes('BETA')) setPlan('BETA')
        else setPlan('FREE')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleToggle(keyword: string, currentActive: boolean) {
    setToggling(keyword)
    try {
      await fetch(`${BACKEND}/app/profile/subscription`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, active: !currentActive }),
      })
      setSubscriptions((prev) =>
        prev.map((s) => s.keyword === keyword ? { ...s, active: !currentActive } : s)
      )
    } catch {
      // keep current state on error
    } finally {
      setToggling(null)
    }
  }

  async function handleDelete(keyword: string) {
    setDeleting(keyword)
    try {
      await fetch(`${BACKEND}/app/profile/subscription/${encodeURIComponent(keyword)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setSubscriptions((prev) => prev.filter((s) => s.keyword !== keyword))
    } catch {
      // keep current state on error
    } finally {
      setDeleting(null)
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/keywords?keyword=ilike.%25${encodeURIComponent(value)}%25&active=eq.true&select=keyword&limit=8`,
          {
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${anonKey}`,
            },
          }
        )
        if (res.ok) {
          const data: KeywordSuggestion[] = await res.json()
          setSuggestions(data)
        }
      } finally {
        setSearchLoading(false)
      }
    }, 300)
  }

  const active = subscriptions.filter((s) => s.active)
  const inactive = subscriptions.filter((s) => !s.active)

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* ── Header ── */}
      <div className="na-screen-header" style={{ padding: '18px 16px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h1 className="na-title" style={{ fontSize: '1.4rem' }}>Il mio profilo</h1>
          <PlanBadge plan={plan} />
        </div>
        <p className="na-label" style={{ letterSpacing: '0.06em' }}>{email}</p>
      </div>

      <div style={{ padding: '16px 16px 0' }}>

        {/* ── Error ── */}
        {error && <div className="na-error">{error}</div>}

        {/* ── Loading ── */}
        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <span className="na-label">Caricamento...</span>
          </div>
        ) : (
          <>
            {/* ── Keyword attive ── */}
            <section style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span className="na-label">Keyword monitorate</span>
                <span
                  className="na-tag na-tag-indigo"
                  style={{ fontSize: 9 }}
                >
                  {active.length}
                </span>
              </div>

              {active.length === 0 && (
                <p style={{ color: 'var(--na-text3)', fontSize: 13 }}>
                  Nessuna keyword attiva. Aggiungine una qui sotto.
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...active, ...inactive].map((sub) => (
                  <div
                    key={sub.keyword}
                    className="na-card"
                    style={{
                      padding: '14px 16px',
                      opacity: sub.active ? 1 : 0.55,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    {/* Row 1: keyword + toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span
                        style={{
                          fontFamily: "'Courier New', Menlo, monospace",
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--na-text)',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {sub.keyword}
                      </span>

                      {/* Toggle */}
                      <button
                        onClick={() => handleToggle(sub.keyword, sub.active)}
                        disabled={toggling === sub.keyword}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        aria-label={sub.active ? 'Disattiva' : 'Attiva'}
                      >
                        <div className={`na-toggle ${sub.active ? 'na-toggle-on' : 'na-toggle-off'}`}
                          style={{ opacity: toggling === sub.keyword ? 0.5 : 1 }}>
                          <div className="na-toggle-knob" />
                        </div>
                      </button>
                    </div>

                    {/* Row 2: price range + source + delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span
                        className="na-mono"
                        style={{ fontSize: 12, color: 'var(--na-text2)' }}
                      >
                        €{sub.min_threshold} — €{sub.max_threshold}
                      </span>
                      <SourceBadge source={sub.source} />
                      <div style={{ marginLeft: 'auto' }}>
                        <button
                          onClick={() => handleDelete(sub.keyword)}
                          disabled={deleting === sub.keyword}
                          className="na-btn na-btn-ghost"
                          style={{
                            padding: '5px 10px',
                            fontSize: 10,
                            color: 'var(--na-red)',
                            borderColor: 'rgba(255,59,92,0.3)',
                            opacity: deleting === sub.keyword ? 0.5 : 1,
                          }}
                        >
                          {deleting === sub.keyword ? '...' : '✕ Elimina'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Aggiungi keyword ── */}
            <section style={{ marginBottom: 32 }}>
              <div style={{ marginBottom: 12 }}>
                <span className="na-label">Aggiungi keyword</span>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cerca una keyword (es. iphone 13)"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
                {searchLoading && (
                  <span
                    className="na-label"
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    ...
                  </span>
                )}
              </div>

              {suggestions.length > 0 && (
                <div
                  className="na-card"
                  style={{ marginTop: 6, overflow: 'hidden' }}
                >
                  {suggestions.map((s, i) => (
                    <div
                      key={s.keyword}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderBottom: i < suggestions.length - 1 ? '1px solid var(--na-border)' : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Courier New', Menlo, monospace",
                          fontSize: 13,
                          color: 'var(--na-text)',
                        }}
                      >
                        {s.keyword}
                      </span>
                      <button
                        className="na-btn na-btn-ghost"
                        style={{ padding: '5px 12px', fontSize: 10 }}
                        onClick={() => alert('Funzionalità in arrivo')}
                      >
                        + Aggiungi
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Logout ── */}
            <div style={{ borderTop: '1px solid var(--na-border)', paddingTop: 20, marginBottom: 8 }}>
              <button
                onClick={handleLogout}
                className="na-btn na-btn-ghost"
                style={{ width: '100%', fontSize: 12, color: 'var(--na-text3)' }}
              >
                Esci dall'account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
