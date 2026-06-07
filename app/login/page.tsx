'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import '../(app)/notte-ai.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      router.push('/app/feed')
    }
  }

  return (
    <div className="notte-ai">
      <div className="na-login-wrap">
        <div className="na-login-card na-fade-up">
          <div className="na-logo-icon">🔍</div>
          <h1 className="na-title" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: 4 }}>
            Lepefy
          </h1>
          <p className="na-label" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            Accedi al tuo account
          </p>

          {error && <div className="na-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="na-btn na-btn-primary"
              style={{ width: '100%', marginTop: 4, fontSize: 13 }}
              disabled={loading}
            >
              {loading ? 'Accesso...' : 'Accedi'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="/register" style={{ color: 'var(--na-indigo)', fontSize: 13, textDecoration: 'none' }}>
              Non hai un account? Registrati
            </a>
            <a href="/" style={{ color: 'var(--na-text3)', fontSize: 12, textDecoration: 'none' }}>
              ← Torna al sito
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
