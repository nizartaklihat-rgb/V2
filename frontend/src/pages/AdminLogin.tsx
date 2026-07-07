import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, ADMIN_EMAIL } from '../lib/supabase'

export default function AdminLogin() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email === ADMIN_EMAIL) nav('/admin')
    })
  }, [nav])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setErr(error.message)
    if (data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut()
      return setErr('Access denied. This account is not the admin.')
    }
    nav('/admin')
  }

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="max-w-md mx-auto px-6">
        <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke mb-3">
          Admin / Sign in
        </div>
        <h1 className="font-display italic text-5xl tracking-tightest">Restricted.</h1>

        <form onSubmit={submit} className="mt-10 space-y-6">
          <div>
            <label className="label">Email</label>
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {err && <div className="p-3 border border-red-300 bg-red-50 text-red-800 text-sm">{err}</div>}
          <button disabled={loading} className="btn-primary w-full justify-center disabled:opacity-40">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-[11px] text-smoke font-mono tracking-[0.14em] uppercase">
            Only {ADMIN_EMAIL || 'the configured admin'} can access this area.
          </p>
        </form>
      </div>
    </main>
  )
}
