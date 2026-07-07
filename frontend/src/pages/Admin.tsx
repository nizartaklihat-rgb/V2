import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, ADMIN_EMAIL } from '../lib/supabase'
import type { Product } from '../types'

const EMPTY: Partial<Product> = {
  name: '',
  slug: '',
  price_mad: 199,
  color: 'black',
  description: '',
  image_url: '',
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  stock: 20,
  active: true,
}

export default function Admin() {
  const nav = useNavigate()
  const [ready, setReady] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email !== ADMIN_EMAIL) {
        nav('/admin/login')
      } else {
        setReady(true)
      }
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user?.email !== ADMIN_EMAIL) nav('/admin/login')
    })
    return () => sub.subscription.unsubscribe()
  }, [nav])

  const load = useCallback(async () => {
    const { data: p } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts((p as Product[]) ?? [])
    const { data: o } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    setOrders(o ?? [])
  }, [])

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  async function signOut() {
    await supabase.auth.signOut()
    nav('/admin/login')
  }

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage
        .from('lmajhol-products')
        .upload(path, file, { cacheControl: '31536000', upsert: false })
      if (error) throw error
      const { data } = supabase.storage.from('lmajhol-products').getPublicUrl(path)
      return data.publicUrl
    } catch (e: any) {
      setMsg(`Upload error: ${e.message}`)
      return null
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    if (!editing) return
    setMsg(null)
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name || ''),
      sizes: editing.sizes ?? ['S', 'M', 'L', 'XL', 'XXL'],
    }
    let error
    if ((editing as Product).id) {
      ;({ error } = await supabase.from('products').update(payload).eq('id', (editing as Product).id))
    } else {
      ;({ error } = await supabase.from('products').insert(payload))
    }
    if (error) setMsg(`Save error: ${error.message}`)
    else {
      setMsg('Saved.')
      setEditing(null)
      load()
    }
  }

  async function del(id: string) {
    if (!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) setMsg(error.message)
    else load()
  }

  if (!ready) {
    return <main className="pt-32 min-h-screen text-center font-mono text-xs text-smoke">Checking access…</main>
  }

  return (
    <main className="pt-24 pb-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8 pb-6 border-b border-mist">
          <div>
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke mb-2">Admin / LMAJHOL</div>
            <h1 className="font-display italic text-4xl md:text-5xl tracking-tightest">Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setTab('products')}
              className={`font-mono text-[11px] tracking-[0.16em] uppercase px-4 py-2 border ${
                tab === 'products' ? 'bg-ink text-bone border-ink' : 'border-mist'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`font-mono text-[11px] tracking-[0.16em] uppercase px-4 py-2 border ${
                tab === 'orders' ? 'bg-ink text-bone border-ink' : 'border-mist'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button onClick={signOut} className="btn-ghost">Sign out</button>
          </div>
        </div>

        {msg && (
          <div className="mb-6 p-3 border border-mist bg-white text-sm font-mono">{msg}</div>
        )}

        {tab === 'products' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setEditing({ ...EMPTY })}
                className="btn-primary"
              >
                + Add product
              </button>
            </div>

            <div className="border border-mist bg-white overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bone">
                  <tr className="text-left font-mono text-[10px] tracking-[0.16em] uppercase text-smoke">
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Color</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Active</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-mist">
                      <td className="p-4">
                        <img src={p.image_url} alt="" className="w-14 h-16 object-cover bg-mist" />
                      </td>
                      <td className="p-4">
                        <div className="font-display italic text-lg">{p.name}</div>
                        <div className="text-[10px] font-mono text-smoke tracking-[0.14em]">/{p.slug}</div>
                      </td>
                      <td className="p-4 capitalize">{p.color}</td>
                      <td className="p-4 font-mono">{p.price_mad} MAD</td>
                      <td className="p-4 font-mono">{p.stock}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-[10px] font-mono tracking-widest uppercase ${p.active ? 'bg-black text-white' : 'bg-mist text-smoke'}`}>
                          {p.active ? 'Live' : 'Off'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setEditing(p)} className="text-xs font-mono uppercase tracking-widest hover:opacity-60 mr-3">Edit</button>
                        <button onClick={() => del(p.id)} className="text-xs font-mono uppercase tracking-widest hover:opacity-60 text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-smoke text-sm">No products yet. Click "Add product".</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <div className="p-8 text-center text-smoke text-sm border border-mist bg-white">
                No orders yet.
              </div>
            )}
            {orders.map((o) => (
              <div key={o.id} className="border border-mist bg-white p-5">
                <div className="flex flex-wrap justify-between gap-4 mb-3 pb-3 border-b border-mist">
                  <div>
                    <div className="font-display italic text-xl">{o.customer?.full_name}</div>
                    <div className="text-[11px] font-mono text-smoke">
                      {o.customer?.phone} · {o.customer?.city} · {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="font-mono text-lg">{o.total_mad} MAD</div>
                </div>
                <div className="text-sm text-smoke mb-2">{o.customer?.address}</div>
                <ul className="text-sm space-y-1">
                  {(o.items || []).map((i: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{i.name} · {i.color} · {i.size} × {i.qty}</span>
                      <span className="font-mono">{i.line_total} MAD</span>
                    </li>
                  ))}
                </ul>
                {o.customer?.notes && (
                  <div className="mt-3 text-sm text-smoke italic">Note: {o.customer.notes}</div>
                )}
                <div className="mt-3 text-[11px] font-mono uppercase tracking-widest">
                  Status: <span className="text-ink">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 z-[100] bg-ink/40 flex items-start justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-bone border border-mist my-8">
              <div className="flex justify-between items-center px-6 py-4 border-b border-mist">
                <div className="font-mono text-[11px] tracking-[0.18em] uppercase">
                  {(editing as Product).id ? 'Edit product' : 'New product'}
                </div>
                <button onClick={() => setEditing(null)} className="text-sm hover:opacity-60">✕</button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Name</label>
                    <input
                      className="field"
                      value={editing.name ?? ''}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">Slug</label>
                    <input
                      className="field"
                      value={editing.slug ?? ''}
                      onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">Price (MAD)</label>
                    <input
                      type="number"
                      className="field"
                      value={editing.price_mad ?? 0}
                      onChange={(e) => setEditing({ ...editing, price_mad: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">Color</label>
                    <select
                      className="field bg-transparent"
                      value={editing.color ?? 'black'}
                      onChange={(e) => setEditing({ ...editing, color: e.target.value as 'black' | 'white' })}
                    >
                      <option value="black">Black</option>
                      <option value="white">White</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Stock</label>
                    <input
                      type="number"
                      className="field"
                      value={editing.stock ?? 0}
                      onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="label">Sizes (comma sep)</label>
                    <input
                      className="field"
                      value={(editing.sizes ?? []).join(',')}
                      onChange={(e) => setEditing({ ...editing, sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows={3}
                    className="field resize-none"
                    value={editing.description ?? ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label">Main image</label>
                  {editing.image_url && (
                    <img src={editing.image_url} alt="" className="w-32 h-40 object-cover bg-mist mb-3" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      const url = await uploadImage(f)
                      if (url) setEditing({ ...editing, image_url: url })
                    }}
                    className="text-sm"
                  />
                  {uploading && <div className="mt-2 text-xs text-smoke font-mono">Uploading…</div>}
                  <input
                    placeholder="Or paste URL"
                    className="field mt-3"
                    value={editing.image_url ?? ''}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  />
                </div>

                <label className="flex items-center gap-3 text-sm font-mono">
                  <input
                    type="checkbox"
                    checked={editing.active ?? true}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  />
                  Active (shown on storefront)
                </label>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-mist">
                <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                <button onClick={save} className="btn-primary">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
