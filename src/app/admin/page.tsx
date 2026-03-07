'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AdminPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'admin' | 'forbidden'>('loading')

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      if (!session?.user?.id) {
        router.replace('/login')
        return
      }
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!mounted) return
          if (data?.role === 'admin') {
            setStatus('admin')
          } else {
            setStatus('forbidden')
            setTimeout(() => router.replace('/'), 2000)
          }
        })
        .catch(() => {
          if (mounted) setStatus('forbidden')
          setTimeout(() => router.replace('/'), 2000)
        })
    })
    return () => { mounted = false }
  }, [router])

  if (status === 'loading') {
    return (
      <main className="koreaterbotec-page">
        <header className="koreaterbotec-header">
          <div className="koreaterbotec-header-inner">
            <Link href="/" className="koreaterbotec-logo">코리아터보텍</Link>
          </div>
        </header>
        <section className="auth-section">
          <p>확인 중...</p>
        </section>
      </main>
    )
  }

  if (status === 'forbidden') {
    return (
      <main className="koreaterbotec-page">
        <header className="koreaterbotec-header">
          <div className="koreaterbotec-header-inner">
            <Link href="/" className="koreaterbotec-logo">코리아터보텍</Link>
          </div>
        </header>
        <section className="auth-section">
          <div className="auth-card">
            <h1>접근 권한이 없습니다</h1>
            <p>관리자만 접근할 수 있습니다. 잠시 후 메인으로 이동합니다.</p>
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
          <div className="koreaterbotec-nav-right">
            <Link href="/" className="koreaterbotec-link">HOME</Link>
            <Link href="/admin" className="koreaterbotec-link">관리자</Link>
          </div>
        </div>
      </header>
      <section className="auth-section">
        <div className="auth-card">
          <h1>관리자</h1>
          <p>관리자 전용 페이지입니다. 여기에 공지 관리, 회원 목록 등 기능을 추가할 수 있습니다.</p>
          <Link href="/" className="auth-button primary">홈으로</Link>
        </div>
      </section>
    </main>
  )
}
