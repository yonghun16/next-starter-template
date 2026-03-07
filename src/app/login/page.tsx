'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { HeaderAuth } from '@/components/HeaderAuth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (signInError) {
      setError(signInError.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : signInError.message)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="koreaterbotec-page">
      <header className="koreaterbotec-header">
        <div className="koreaterbotec-header-inner">
          <Link href="/" className="koreaterbotec-logo">코리아터보텍</Link>
          <HeaderAuth />
        </div>
      </header>

      <section className="auth-section">
        <div className="auth-card">
          <h1>로그인</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-button primary" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <p className="auth-footer">
            계정이 없으신가요? <Link href="/signup" className="koreaterbotec-link">회원가입</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
