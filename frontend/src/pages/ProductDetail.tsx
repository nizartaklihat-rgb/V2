import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductBySlug } from '../lib/products'
import type { Product } from '../types'
import { useCart } from '../lib/cart'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [size, setSize] = useState<string | null>(null)
  const add = useCart((s) => s.add)

  useEffect(() => {
    if (!slug) return
    fetchProductBySlug(slug).then((p) => {
      setProduct(p)
      if (p?.sizes?.length) setSize(p.sizes[Math.floor(p.sizes.length / 2)])
    })
  }, [slug])

  if (!product) {
    return (
      <main className="pt-32 min-h-screen max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="py-24 text-center font-mono text-[11px] tracking-[0.18em] uppercase text-smoke">
          Loading<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
        </div>
      </main>
    )
  }

  const gallery = [product.image_url, ...(product.gallery_urls ?? [])]

  return (
    <main className="pt-24 pb-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-8 font-mono text-[10px] tracking-[0.18em] uppercase text-smoke">
          <Link to="/shop" className="hover:opacity-60">← Back to shop</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          {/* Gallery */}
          <div className="md:col-span-7 space-y-4">
            {gallery.map((src, i) => (
              <div key={i} className="bg-mist aspect-[4/5] overflow-hidden">
                <img src={src} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke mb-3">
                LMAJHOL / {product.color === 'black' ? 'Black' : 'White'}
              </div>
              <h1 className="font-display italic text-4xl md:text-5xl leading-[0.95] tracking-tightest">
                {product.name}
              </h1>
              <div className="mt-4 font-mono text-lg">{product.price_mad} MAD</div>

              <p className="mt-8 text-base leading-relaxed text-smoke">{product.description}</p>

              <div className="mt-10">
                <div className="label mb-3">Size</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[52px] h-11 border font-mono text-sm tracking-widest transition ${
                        size === s
                          ? 'border-ink bg-ink text-bone'
                          : 'border-mist hover:border-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => size && add(product, size, 1)}
                disabled={!size}
                className="btn-primary w-full justify-center mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to bag — {product.price_mad} MAD
              </button>

              <div className="mt-6 pt-6 border-t border-mist space-y-3 text-sm text-smoke">
                <div className="flex justify-between">
                  <span>Payment</span>
                  <span className="text-ink">Cash on delivery</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-ink">2–4 days across Morocco</span>
                </div>
                <div className="flex justify-between">
                  <span>Returns</span>
                  <span className="text-ink">7 days, free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
