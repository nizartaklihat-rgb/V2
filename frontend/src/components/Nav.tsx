import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { useEffect, useState } from 'react'

export default function Nav() {
  const count = useCart((s) => s.count())
  const setOpen = useCart((s) => s.setOpen)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-bone/85 backdrop-blur-md border-b border-mist'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-display italic text-2xl tracking-tightest hover:opacity-70 transition"
        >
          LMAJHOL
        </Link>

        <nav className="hidden md:flex items-center gap-10 font-mono text-[11px] tracking-[0.16em] uppercase">
          <Link to="/" className="hover:opacity-60 transition">Home</Link>
          <Link to="/shop" className="hover:opacity-60 transition">Shop</Link>
          <a href="#story" className="hover:opacity-60 transition">Story</a>
          <a href="#contact" className="hover:opacity-60 transition">Contact</a>
        </nav>

        <button
          onClick={() => setOpen(true)}
          className="font-mono text-[11px] tracking-[0.16em] uppercase hover:opacity-60 transition flex items-center gap-2"
          aria-label="Open cart"
        >
          <span>Bag</span>
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 bg-ink text-bone rounded-full text-[10px]">
            {count}
          </span>
        </button>
      </div>
    </header>
  )
}
