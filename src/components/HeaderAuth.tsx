'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export type UserRole = 'user' | 'admin' | null

export function HeaderAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    try {
      const supabase = createClient()
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user?.id) {
            supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle()
              .then(({ data }) => {
                if (mounted) {
                  setRole(data?.role === 'admin' ? 'admin' : 'user')
                  setLoading(false)
                }
              })
              .catch(() => {
                if (mounted) {
                  setRole('user')
                  setLoading(false)
                }
              })
          } else {
            setRole(null)
            setLoading(false)
          }
        } else setLoading(false)
      })
      const {
        data: { subscription },
      } =       supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        if (session?.user?.id) {
          supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle()
            .then(({ data }) => {
              if (mounted) setRole(data?.role === 'admin' ? 'admin' : 'user')
            })
            .catch(() => { if (mounted) setRole('user') })
        } else {
          setRole(null)
        }
      })
      return () => {
        mounted = false
        subscription.unsubscribe()
      }
    } catch {
      if (mounted) setLoading(false)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch {
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="koreaterbotec-nav-right">
        <Link href="/" className="koreaterbotec-link">HOME</Link>
        <span className="koreaterbotec-link" style={{ opacity: 0.6 }}>...</span>
      </div>
    )
  }

  if (user) {
    return (
      <div className="koreaterbotec-nav-right">
        <Link href="/" className="koreaterbotec-link">HOME</Link>
        {role === 'admin' && (
          <Link href="/admin" className="koreaterbotec-link">관리자</Link>
        )}
        <button type="button" onClick={handleLogout} className="auth-logout-btn">
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <div className="koreaterbotec-nav-right">
      <Link href="/" className="koreaterbotec-link">HOME</Link>
      <Link href="/signup" className="koreaterbotec-link">회원가입</Link>
      <Link href="/login" className="koreaterbotec-link">로그인</Link>
    </div>
  )
}
