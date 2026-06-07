'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

const BACKEND = 'https://lepefy-backend-production.up.railway.app'
const DELAY_HOURS = 48

interface Deal {
  id: string
  title: string
  price_value: number
  margine_stimato: number | null
  score: number | null
  source: string
  location: string | null
  condition: string | null
  image_url: string | null
  url: string | null
  keyword: string | null
  created_at: string
  body: string | null
  margin: number | null
  margin_pct: number | null
}

interface Subscription {
  keyword: string
  min_threshold: number | null
  max_threshold: number | null
  active: boolean
  is_collector: boolean
  include_defective: boolean
  source: string | null
  plan: string
}

// ─── helpers ────────────────────────────────────────────────────────────────

function minutesAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 60) return `${diff}m fa`
  const h = Math.floor(diff / 60)
  if (h < 24) return `${h}h fa`
  return `${Math.floor(h / 24)}g fa`
}

function marginColor(pct: number | null): string {
  if (pct === null) return '#6B8AFF'
  if (pct >= 35) return '#00E87A'
  if (pct >= 25) return '#6B8AFF'
  return '#FFB800'
}

function sourceLabel(src: string): string {
  const l = src.toLowerCase()
  if (l.includes('subito')) return 'SUBITO'
  if (l.includes('vinted')) return 'VINTED'
  return src.toUpperCase()
}

function sourceTagClass(src: string): string {
  const l = src.toLowerCase()
  if (l.includes('subito')) return 'na-tag na-tag-subito'
  if (l.includes('vinted')) return 'na-tag na-tag-vinted'
  return 'na-tag na-tag-indigo'
}

// ─── card components ─────────────────────────────────────────────────────────

function FlipperCard({ deal }: { deal: Deal }) {
  const hot = (deal.score ?? 0) >= 9
  return (
    <div
      className={`na-card na-fade-up${hot ? ' na-card-hot' : ''}`}
      style={{ marginBottom: 12, cursor: deal.url ? 'pointer' : 'default', padding: '14px 16px' }}
      onClick={() => deal.url && window.open(deal.url, '_blank')}
    >
      {/* Row 1: source badge + HOT + score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span className={sourceTagClass(deal.source)}>{sourceLabel(deal.source)}</span>
        {hot && (
          <span className="na-tag na-tag-orange" style={{ animation: 'na-glow-pulse 2s ease-in-out infinite' }}>
            🔥 HOT
          </span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <span className={`na-score ${hot ? 'na-score-orange' : 'na-score-indigo'}`}>
            {deal.score ?? '—'}/10
          </span>
        </div>
      </div>

      {/* Row 2: title + keyword */}
      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontFamily: 'var(--na-font-body)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--na-text)',
          lineHeight: 1.35,
          marginBottom: 3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {deal.title}
        </div>
        {deal.keyword && (
          <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text3)' }}>
            {deal.keyword}
          </span>
        )}
      </div>

      {/* Row 3: price + market */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
        <span className="na-price" style={{ fontSize: 22 }}>
          €{deal.price_value}
        </span>
        {deal.margine_stimato !== null && (
          <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 11, color: 'var(--na-text3)' }}>
            Mercato ~€{deal.margine_stimato + deal.price_value}
          </span>
        )}
      </div>

      {/* Row 4: margin */}
      {deal.margin !== null && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontFamily: 'var(--na-font-mono)',
              fontSize: 13,
              fontWeight: 700,
              color: marginColor(deal.margin_pct),
            }}>
              +€{deal.margin}
            </span>
            {deal.margin_pct !== null && (
              <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text2)' }}>
                +{deal.margin_pct}%
              </span>
            )}
          </div>
          <div className="na-margin-bar">
            <div
              className="na-margin-fill"
              style={{
                width: `${Math.min(deal.margin_pct ?? 0, 100)}%`,
                background: marginColor(deal.margin_pct),
              }}
            />
          </div>
        </div>
      )}

      {/* Row 5: location + time + save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        {deal.location && (
          <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📍 {deal.location}
          </span>
        )}
        <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text3)', whiteSpace: 'nowrap' }}>
          {minutesAgo(deal.created_at)}
        </span>
        <button
          className="na-btn na-btn-ghost"
          style={{ padding: '4px 10px', fontSize: 10, marginLeft: 4 }}
          onClick={(e) => { e.stopPropagation() }}
        >
          🔖 Salva
        </button>
      </div>
    </div>
  )
}

function CollectorCard({ deal }: { deal: Deal }) {
  return (
    <div
      className="na-card na-fade-up"
      style={{ marginBottom: 12, cursor: deal.url ? 'pointer' : 'default', padding: '14px 16px' }}
      onClick={() => deal.url && window.open(deal.url, '_blank')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span className="na-tag na-tag-vinted">VINTED</span>
      </div>
      <div style={{ fontFamily: 'var(--na-font-body)', fontSize: 14, fontWeight: 700, color: 'var(--na-text)', marginBottom: 4, lineHeight: 1.35 }}>
        {deal.title}
      </div>
      {deal.keyword && (
        <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text3)', display: 'block', marginBottom: 8 }}>
          {deal.keyword}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="na-price" style={{ fontSize: 20 }}>€{deal.price_value}</span>
        {deal.condition && (
          <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text2)' }}>
            {deal.condition}
          </span>
        )}
        {deal.location && (
          <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text3)', marginLeft: 'auto' }}>
            📍 {deal.location}
          </span>
        )}
      </div>
    </div>
  )
}

function RepairerCard({ deal }: { deal: Deal }) {
  return (
    <div
      className="na-card na-fade-up"
      style={{ marginBottom: 12, cursor: deal.url ? 'pointer' : 'default', padding: '14px 16px' }}
      onClick={() => deal.url && window.open(deal.url, '_blank')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span className="na-tag na-tag-vinted">VINTED</span>
        <span className="na-tag na-tag-yellow">DIFETTOSO</span>
      </div>
      <div style={{ fontFamily: 'var(--na-font-body)', fontSize: 14, fontWeight: 700, color: 'var(--na-text)', marginBottom: 8, lineHeight: 1.35 }}>
        {deal.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="na-price" style={{ fontSize: 20 }}>€{deal.price_value}</span>
        {deal.condition && (
          <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text2)' }}>
            {deal.condition}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

type FilterType = 'tutti' | 'subito' | 'vinted' | 'score9'

export default function FeedPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [plan, setPlan] = useState<string>('free')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<FilterType>('tutti')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const token = session.access_token
      const headers = { Authorization: `Bearer ${token}` }

      const [feedRes, profileRes] = await Promise.all([
        fetch(`${BACKEND}/app/feed?limit=30`, { headers }),
        fetch(`${BACKEND}/app/profile`, { headers }),
      ])

      if (!feedRes.ok) throw new Error(`Feed ${feedRes.status}`)

      const feedData = await feedRes.json()
      const profileData = profileRes.ok ? await profileRes.json() : { subscriptions: [] }

      setDeals(feedData.deals ?? [])
      setPlan(feedData.plan ?? 'free')
      setSubscriptions(profileData.subscriptions ?? [])
      setLoading(false)
    }

    load().catch(() => { setError('Errore fetch'); setLoading(false) })
  }, [])

  const isPro = plan === 'beta' || plan === 'pro'
  const isCollector = subscriptions.some((s) => s.is_collector)
  const isRepairer = subscriptions.some((s) => s.include_defective)

  // free tier filter
  const tieredDeals = isPro
    ? deals
    : deals
        .filter((d) => {
          const hoursAgo = (Date.now() - new Date(d.created_at).getTime()) / 36e5
          return hoursAgo >= DELAY_HOURS
        })
        .slice(0, 10)

  // pro filters
  const filteredDeals = isPro ? tieredDeals.filter((d) => {
    if (filter === 'subito') return d.source.toLowerCase().includes('subito')
    if (filter === 'vinted') return d.source.toLowerCase().includes('vinted')
    if (filter === 'score9') return (d.score ?? 0) >= 9
    return true
  }) : tieredDeals

  const proFilters: { key: FilterType; label: string }[] = [
    { key: 'tutti',  label: 'Tutti' },
    { key: 'subito', label: 'Subito' },
    { key: 'vinted', label: 'Vinted' },
    { key: 'score9', label: 'Score 9+' },
  ]

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* ── Sticky header ── */}
      <div className="na-screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <h1 className="na-title" style={{ fontSize: 22 }}>Deal Live</h1>
          <span className="na-live-dot" />
          <span style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text3)', marginLeft: 2 }}>
            {loading ? '...' : `${filteredDeals.length} deal · aggiornato oggi`}
          </span>
        </div>

        {isPro && (
          <div className="na-filters">
            {proFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`na-filter-pill ${filter === f.key ? 'na-filter-pill-active' : 'na-filter-pill-idle'}`}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Free tier banner ── */}
      {!isPro && !loading && (
        <div style={{
          margin: '12px 16px 0',
          background: 'var(--na-indigo-dim)',
          border: '1px solid rgba(107,138,255,0.25)',
          borderRadius: 'var(--na-radius-sm)',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--na-font-body)', fontSize: 13, color: 'var(--na-text)', marginBottom: 2 }}>
              🔒 Stai vedendo deal con 48h di ritardo.
            </div>
            <div style={{ fontFamily: 'var(--na-font-mono)', fontSize: 10, color: 'var(--na-text3)' }}>
              I deal in tempo reale sono disponibili con il piano Pro.
            </div>
          </div>
          <a
            href="/app/profile"
            className="na-btn na-btn-primary"
            style={{ fontSize: 10, padding: '8px 12px', whiteSpace: 'nowrap', textDecoration: 'none' }}
          >
            Passa a Pro →
          </a>
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ padding: '12px 16px 16px' }}>
        {loading && (
          <div style={{ padding: '2rem', color: 'var(--na-text2)', fontFamily: 'var(--na-font-mono)', fontSize: '11px', letterSpacing: '0.1em', textAlign: 'center' }}>
            CARICAMENTO DEAL...
          </div>
        )}

        {!loading && error && (
          <div className="na-error" style={{ margin: '1rem 0' }}>
            Errore nel caricamento dei deal. Riprova.
          </div>
        )}

        {!loading && !error && filteredDeals.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <div style={{ color: 'var(--na-text2)', fontFamily: 'var(--na-font-body)', fontSize: '14px' }}>
              Nessun deal trovato per le tue keyword.<br />
              Controlla la configurazione in{' '}
              <a href="/app/profile" style={{ color: 'var(--na-indigo)' }}>Profilo</a>.
            </div>
          </div>
        )}

        {!loading && !error && filteredDeals.map((deal) => {
          if (isRepairer) return <RepairerCard key={deal.id} deal={deal} />
          if (isCollector) return <CollectorCard key={deal.id} deal={deal} />
          return <FlipperCard key={deal.id} deal={deal} />
        })}
      </div>
    </div>
  )
}
