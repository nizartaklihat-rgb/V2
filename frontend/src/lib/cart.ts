import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

type CartState = {
  items: CartItem[]
  open: boolean
  add: (product: Product, size: string, qty?: number) => void
  remove: (product_id: string, size: string) => void
  updateQty: (product_id: string, size: string, qty: number) => void
  clear: () => void
  setOpen: (v: boolean) => void
  subtotal: () => number
  count: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      add: (product, size, qty = 1) => {
        const items = [...get().items]
        const idx = items.findIndex((i) => i.product.id === product.id && i.size === size)
        if (idx >= 0) items[idx].qty += qty
        else items.push({ product, size, qty })
        set({ items, open: true })
      },
      remove: (product_id, size) => {
        set({ items: get().items.filter((i) => !(i.product.id === product_id && i.size === size)) })
      },
      updateQty: (product_id, size, qty) => {
        if (qty <= 0) return get().remove(product_id, size)
        set({
          items: get().items.map((i) =>
            i.product.id === product_id && i.size === size ? { ...i, qty } : i,
          ),
        })
      },
      clear: () => set({ items: [] }),
      setOpen: (v) => set({ open: v }),
      subtotal: () => get().items.reduce((s, i) => s + i.product.price_mad * i.qty, 0),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
    }),
    { name: 'lmajhol-cart' },
  ),
)
