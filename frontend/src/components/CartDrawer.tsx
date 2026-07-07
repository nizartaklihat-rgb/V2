import { useCart } from '../lib/cart'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const { items, open, setOpen, updateQty, remove, subtotal, count } = useCart()

  return (
    <>
      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-[440px] bg-bone shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-mist">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase">
              Bag <span className="text-smoke">/ {count()} items</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="font-mono text-[11px] tracking-[0.18em] uppercase hover:opacity-60"
              aria-label="Close cart"
            >
              Close ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {items.length === 0 ? (
              <div className="text-center py-24">
                <div className="font-display italic text-2xl mb-2">Your bag is empty.</div>
                <div className="text-sm text-smoke mb-8">Start with an essential.</div>
                <Link to="/shop" onClick={() => setOpen(false)} className="btn-primary">
                  Shop the drop
                </Link>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((it) => (
                  <li key={it.product.id + it.size} className="flex gap-4 pb-6 border-b border-mist">
                    <img
                      src={it.product.image_url}
                      alt={it.product.name}
                      className="w-20 h-24 object-cover bg-mist"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-display italic text-lg leading-tight">{it.product.name}</div>
                      <div className="mt-1 text-[11px] font-mono tracking-[0.14em] uppercase text-smoke">
                        Size {it.size} · {it.product.color}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-mist">
                          <button
                            onClick={() => updateQty(it.product.id, it.size, it.qty - 1)}
                            className="px-3 py-1 hover:bg-mist"
                            aria-label="decrease"
                          >
                            −
                          </button>
                          <span className="px-3 text-sm font-mono">{it.qty}</span>
                          <button
                            onClick={() => updateQty(it.product.id, it.size, it.qty + 1)}
                            className="px-3 py-1 hover:bg-mist"
                            aria-label="increase"
                          >
                            +
                          </button>
                        </div>
                        <div className="font-mono text-sm">{it.product.price_mad * it.qty} MAD</div>
                      </div>
                      <button
                        onClick={() => remove(it.product.id, it.size)}
                        className="mt-2 text-[10px] font-mono tracking-[0.14em] uppercase text-smoke hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-mist">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-smoke font-mono text-[11px] tracking-[0.16em] uppercase">Subtotal</span>
                <span className="font-mono">{subtotal()} MAD</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-smoke font-mono text-[11px] tracking-[0.16em] uppercase">Shipping</span>
                <span className="font-mono text-smoke">Calculated at checkout</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary w-full justify-center"
              >
                Checkout — Cash on delivery
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
