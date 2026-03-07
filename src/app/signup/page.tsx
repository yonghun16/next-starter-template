'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { HeaderAuth } from '@/components/HeaderAuth'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: name ? { full_name: name } : undefined,
        },
      })

      setLoading(false)

      if (signUpError) {
        setError(signUpError.message === 'User already registered' ? '이미 가입된 이메일입니다.' : signUpError.message)
        return
      }

      if (data?.user?.identities?.length === 0) {
        setError('이미 가입된 이메일입니다.')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/'), 3000)
    } catch (err) {
      setLoading(false)
      const message = err instanceof Error ? err.message : '회원가입 처리 중 오류가 발생했습니다.'
      setError(message)
    }
  }

  if (success) {
    return (
      <main className="koreaterbotec-page">
        <header className="koreaterbotec-header">
          <div className="koreaterbotec-header-inner">
            <Link href="/" className="koreaterbotec-logo">코리아터보텍</Link>
            <HeaderAuth />
          </div>
        </header>
        <section className="auth-section">
          <div className="auth-card auth-success">
            <h1>회원가입 완료</h1>
            <p>가입해 주셔서 감사합니다.</p>
            <p className="auth-note">
              이메일 인증이 설정되어 있다면 확인 메일을 보냈습니다. 링크를 클릭해 인증을 완료해 주세요.
            </p>
            <Link href="/" className="auth-button primary">홈으로</Link>
          </div>
        </section>
      </main>
    )
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
          <h1>회원가입</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="name">이름 (선택)</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름"
                autoComplete="name"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="email">이메일 *</label>
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
              <label htmlFor="password">비밀번호 *</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="passwordConfirm">비밀번호 확인 *</label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 다시 입력"
                required
                autoComplete="new-password"
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-button primary" disabled={loading}>
              {loading ? '처리 중...' : '가입하기'}
            </button>
          </form>
          <p className="auth-footer">
            이미 계정이 있으신가요? <Link href="/login" className="koreaterbotec-link">로그인</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
