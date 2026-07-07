import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

const HeroScene = lazy(() => import('../scenes/HeroScene'))

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const scrollProgress = useRef(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts().then(setProducts)
  }, [])

  // Pin hero, drive scrollProgress from 0..1, scrub scene camera
  useEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: '+=180%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress
        },
      })

      // Fade hero words in / out with scroll
      gsap.fromTo(
        '.hero-line-1',
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -30,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=60%',
            scrub: 1,
          },
        },
      )
      gsap.fromTo(
        '.hero-line-2',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top+=40% top',
            end: '+=60%',
            scrub: 1,
          },
        },
      )
      gsap.fromTo(
        '.hero-line-3',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top+=100% top',
            end: '+=60%',
            scrub: 1,
          },
        },
      )

      return () => st.kill()
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // Reveal-on-scroll for lower sections
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.15 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [products])

  return (
    <main>
      {/* HERO — pinned, 3D canvas + scroll text */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <div className="hero-canvas">
          <Suspense fallback={<div className="w-full h-full bg-bone" />}>
            <HeroScene scrollProgress={scrollProgress} />
          </Suspense>
        </div>

        {/* Overlay text — layered on top of canvas */}
        <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
          <div className="pt-28 px-6 md:px-10 max-w-[1400px] mx-auto w-full flex justify-between items-start">
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke">
              Drop 001<br />
              <span className="text-ink">Winter 26</span>
            </div>
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke text-right">
              Cash on delivery<br />
              <span className="text-ink">Ships from Casablanca</span>
            </div>
          </div>

          {/* Center scroll-driven headline */}
          <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
            <div className="text-center relative w-full max-w-3xl">
              <div className="hero-line-1 absolute inset-0 flex items-center justify-center">
                <h1 className="font-display italic text-[14vw] md:text-[9vw] leading-[0.9] tracking-tightest text-ink">
                  LMAJHOL
                </h1>
              </div>
              <div className="hero-line-2 absolute inset-0 flex items-center justify-center opacity-0">
                <h2 className="font-display italic text-[7vw] md:text-[4.5vw] leading-[1] tracking-tightest text-ink max-w-3xl">
                  One founder.<br />Two tees.
                </h2>
              </div>
              <div className="hero-line-3 absolute inset-0 flex items-center justify-center opacity-0">
                <h2 className="font-display italic text-[7vw] md:text-[4.5vw] leading-[1] tracking-tightest text-ink">
                  Nothing else.
                </h2>
              </div>
            </div>
          </div>

          <div className="pb-8 px-6 md:px-10 max-w-[1400px] mx-auto w-full flex justify-between items-end">
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke">
              ↓ Scroll to reveal
            </div>
            <Link
              to="/shop"
              className="pointer-events-auto font-mono text-[11px] tracking-[0.18em] uppercase border-b border-ink pb-1 hover:opacity-60"
            >
              Shop the drop →
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-mist bg-bone overflow-hidden py-6">
        <div className="marquee-track whitespace-nowrap flex gap-16 font-display italic text-4xl md:text-6xl tracking-tightest">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              <span>Oversized.</span>
              <span className="text-smoke">·</span>
              <span>240gsm cotton.</span>
              <span className="text-smoke">·</span>
              <span>Cut in Casablanca.</span>
              <span className="text-smoke">·</span>
              <span>Two colors.</span>
              <span className="text-smoke">·</span>
              <span>One founder.</span>
              <span className="text-smoke">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between mb-12 md:mb-20 reveal">
          <div>
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke mb-3">
              The Drop / 002
            </div>
            <h2 className="font-display italic text-5xl md:text-7xl tracking-tightest leading-[0.95]">
              Two essentials.<br />Made to layer.
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-block font-mono text-[11px] tracking-[0.18em] uppercase border-b border-ink pb-1 hover:opacity-60"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {products.slice(0, 2).map((p, i) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              className="reveal group block"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative overflow-hidden bg-mist aspect-[4/5]">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.18em] uppercase bg-bone px-2 py-1">
                  {p.color === 'black' ? '— Black' : '— White'}
                </div>
              </div>
              <div className="mt-4 flex justify-between items-baseline">
                <div>
                  <div className="font-display italic text-2xl tracking-tightest">{p.name}</div>
                  <div className="text-[11px] font-mono tracking-[0.14em] uppercase text-smoke mt-1">
                    {p.sizes.join(' · ')}
                  </div>
                </div>
                <div className="font-mono">{p.price_mad} MAD</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32 border-t border-mist">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 reveal">
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke">
              — The Story
            </div>
          </div>
          <div className="md:col-span-8 reveal">
            <h2 className="font-display italic text-4xl md:text-6xl leading-[1.05] tracking-tightest">
              LMAJHOL is a small studio in Casablanca making the tees I always wanted to buy and never found.
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-smoke">
              No mascots. No graphics. Just heavyweight cotton, cut boxy, dyed clean.
              Delivered to your door across Morocco — pay when it arrives.
            </p>
            <div className="mt-10 flex gap-6">
              <Link to="/shop" className="btn-primary">
                Shop the drop
              </Link>
              <a href="#contact" className="btn-ghost">Contact</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
