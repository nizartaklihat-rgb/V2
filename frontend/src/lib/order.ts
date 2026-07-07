import type { OrderPayload } from '../types'
import { supabase } from './supabase'

/**
 * Submit order:
 *   1) Insert into Supabase `orders` table (backup / admin dashboard)
 *   2) Call Netlify function that forwards to Telegram bot
 */
export async function submitOrder(payload: OrderPayload): Promise<{ ok: boolean; error?: string }> {
  // 1. Save to Supabase (non-blocking-ish; we still try Telegram if this fails)
  try {
    await supabase.from('orders').insert({
      customer: payload.customer,
      items: payload.items,
      subtotal_mad: payload.subtotal_mad,
      shipping_mad: payload.shipping_mad,
      total_mad: payload.total_mad,
      payment_method: payload.payment_method,
      status: 'new',
    })
  } catch (e) {
    console.warn('[LMAJHOL] Supabase order insert failed:', e)
  }

  // 2. Notify Telegram via Netlify function
  try {
    const res = await fetch('/.netlify/functions/telegram-order', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: `Telegram: ${text}` }
    }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Network error' }
  }
}
