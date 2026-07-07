// Netlify serverless function: forwards new order to Telegram bot.
// Env vars required in Netlify dashboard:
//   TELEGRAM_BOT_TOKEN   - from BotFather
//   TELEGRAM_CHAT_ID     - your personal chat id (get from @userinfobot)

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    return new Response('Server not configured', { status: 500 })
  }

  let order
  try {
    order = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const c = order.customer || {}
  const items = Array.isArray(order.items) ? order.items : []
  const lines = items.map(
    (i, idx) =>
      `${idx + 1}. ${i.name} — ${i.color} · ${i.size} × ${i.qty} = ${i.line_total} MAD`,
  )

  const text =
    `🛍️ *NEW LMAJHOL ORDER*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `*Customer:* ${escape(c.full_name)}\n` +
    `*Phone:* ${escape(c.phone)}\n` +
    `*City:* ${escape(c.city)}\n` +
    `*Address:* ${escape(c.address)}\n` +
    (c.notes ? `*Notes:* ${escape(c.notes)}\n` : '') +
    `━━━━━━━━━━━━━━━━━━\n` +
    `*Items:*\n${lines.join('\n')}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `Subtotal: ${order.subtotal_mad} MAD\n` +
    `Shipping: ${order.shipping_mad} MAD\n` +
    `*TOTAL: ${order.total_mad} MAD*\n` +
    `Payment: Cash on delivery\n` +
    `Received: ${new Date(order.created_at).toLocaleString('fr-MA')}`

  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const tgRes = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  })

  if (!tgRes.ok) {
    const errBody = await tgRes.text()
    return new Response(`Telegram error: ${errBody}`, { status: 502 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  })
}

// Telegram Markdown requires escaping these chars
function escape(s) {
  return String(s ?? '')
    .replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
    .slice(0, 500)
}

export const config = { path: '/.netlify/functions/telegram-order' }
