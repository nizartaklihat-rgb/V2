import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { submitOrder } from '../lib/order'
import type { OrderPayload } from '../types'

const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Salé',
  'Safi',
  'Mohammedia',
  'El Jadida',
  'Nador',
  'Béni Mellal',
  'Taza',
  'Khouribga',
  'Settat',
  'Larache',
  'Ksar El Kébir',
  'Khemisset',
]

const SHIPPING_MAD = 30

export default function Checkout() {
  const nav = useNavigate()
  const { items, subtotal, clear } = useCart()
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: 'Casablanca',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const sub = subtotal()
  const total = sub + (items.length ? SHIPPING_MAD : 0)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    if (!form.full_name || !form.phone || !form.address || !form.city) {
      setErr('Please fill all required fields.')
      return
    }
    if (items.length === 0) {
      setErr('Your bag is empty.')
      return
    }

    setSubmitting(true)
    const payload: OrderPayload = {
      customer: {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city,
        notes: form.notes.trim() || undefined,
      },
      items: items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        color: i.product.color,
        size: i.size,
        qty: i.qty,
        unit_price: i.product.price_mad,
        line_total: i.product.price_mad * i.qty,
      })),
      subtotal_mad: sub,
      shipping_mad: SHIPPING_MAD,
      total_mad: total,
      payment_method: 'cash_on_delivery',
      created_at: new Date().toISOString(),
    }
    const res = await submitOrder(payload)
    setSubmitting(false)
    if (!res.ok) {
      setErr(res.error ?? 'Could not send order. Please try again or contact us on WhatsApp.')
      return
    }
    clear()
    nav('/thank-you')
  }

  return (
    <main className="pt-28 pb-24 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="mb-8">
          <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke mb-3">
            Checkout / Cash on delivery
          </div>
          <h1 className="font-display italic text-4xl md:text-6xl tracking-tightest leading-[0.95]">
            Almost yours.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <form onSubmit={onSubmit} className="lg:col-span-7 space-y-8">
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase mb-6 pb-3 border-b border-mist">
                Shipping details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Full name *</label>
                  <input
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="field"
                    placeholder="Your name as on ID"
                  />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="field"
                    placeholder="+212 6.. .. .. .."
                    type="tel"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Address *</label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="field"
                    placeholder="Street, building, apartment"
                  />
                </div>
                <div>
                  <label className="label">City *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="field bg-transparent"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label">Notes for delivery (optional)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="field resize-none"
                    placeholder="Landmark, best time to call, etc."
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border border-mist bg-white">
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2">
                Payment · Cash on delivery
              </div>
              <div className="text-sm text-smoke leading-relaxed">
                You'll pay in cash to the courier when your order arrives. No card needed. We will call to
                confirm before shipping.
              </div>
            </div>

            {err && (
              <div className="p-4 border border-red-300 bg-red-50 text-red-800 text-sm">{err}</div>
            )}

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="btn-primary w-full md:w-auto justify-center disabled:opacity-40"
            >
              {submitting ? 'Sending order…' : `Confirm order — ${total} MAD`}
            </button>
          </form>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <div className="border border-mist bg-white p-6 md:sticky md:top-28">
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase mb-6 pb-3 border-b border-mist">
                Your bag ({items.length})
              </div>

              {items.length === 0 ? (
                <div className="text-smoke text-sm py-8 text-center">Bag is empty.</div>
              ) : (
                <ul className="space-y-4 mb-6">
                  {items.map((it) => (
                    <li key={it.product.id + it.size} className="flex gap-3">
                      <img src={it.product.image_url} alt={it.product.name} className="w-16 h-20 object-cover bg-mist" />
                      <div className="flex-1 min-w-0 text-sm">
                        <div className="font-display italic text-base">{it.product.name}</div>
                        <div className="text-[10px] font-mono tracking-[0.16em] uppercase text-smoke mt-1">
                          Size {it.size} · Qty {it.qty}
                        </div>
                      </div>
                      <div className="font-mono text-sm">{it.product.price_mad * it.qty} MAD</div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-4 border-t border-mist space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-smoke">Subtotal</span>
                  <span className="font-mono">{sub} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-smoke">Shipping</span>
                  <span className="font-mono">{items.length ? SHIPPING_MAD : 0} MAD</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-mist">
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase">Total</span>
                  <span className="font-mono text-lg">{total} MAD</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
