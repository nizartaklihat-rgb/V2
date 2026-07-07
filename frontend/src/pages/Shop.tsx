import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/products'
import type { Product } from '../types'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts().then((p) => {
      setProducts(p)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.15 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [products])

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-12 md:mb-20 reveal">
          <div>
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke mb-3">
              Shop / All
            </div>
            <h1 className="font-display italic text-5xl md:text-7xl tracking-tightest leading-[0.95]">
              The full drop.
            </h1>
          </div>
          <div className="hidden md:block font-mono text-[11px] tracking-[0.18em] uppercase text-smoke">
            {products.length} pieces
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center font-mono text-[11px] tracking-[0.18em] uppercase text-smoke">
            Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((p, i) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="reveal group block"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
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
                    <div className="font-display italic text-xl tracking-tightest">{p.name}</div>
                    <div className="text-[11px] font-mono tracking-[0.14em] uppercase text-smoke mt-1">
                      {p.sizes.join(' · ')}
                    </div>
                  </div>
                  <div className="font-mono text-sm">{p.price_mad} MAD</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
