'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import '../(app)/notte-ai.css'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri.')
      return
    }
    if (password !== confirm) {
      setError('Le password non coincidono.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + '/app/feed' },
    })
    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      router.push('/register/confirm')
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
          <p className="na-label" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Crea il tuo account
          </p>

          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span className="na-tag na-tag-indigo">Piano gratuito — nessuna carta richiesta</span>
          </div>

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
              placeholder="Password (min. 8 caratteri)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Conferma password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="submit"
              className="na-btn na-btn-primary"
              style={{ width: '100%', marginTop: 4, fontSize: 13 }}
              disabled={loading}
            >
              {loading ? 'Registrazione...' : 'Registrati'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="/login" style={{ color: 'var(--na-indigo)', fontSize: 13, textDecoration: 'none' }}>
              Hai già un account? Accedi
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
