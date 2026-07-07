# LMAJHOL — Oversized Essentials Storefront

Premium 3D e-commerce site for **LMAJHOL**, a small clothing label from Casablanca selling oversized black & white tees.

- 3D hero built with **React Three Fiber** (your GLB avatar float-orbits with scroll-driven camera)
- Scroll storytelling via **GSAP ScrollTrigger** (pinned hero, camera dolly, headline crossfade)
- **Editorial minimalist** design (Fear of God / Jacquemus energy) via the `taste-skill` minimalist protocol
- **Cash on delivery** checkout — Moroccan cities preset, phone-based, no card
- Orders → **Telegram bot** notification + Supabase log
- **Admin dashboard** at `/admin` (Supabase Auth, only your email allowed): add/edit/delete products, upload images, view orders
- **Free hosting**: Netlify (static) + Netlify Functions (serverless Telegram) + Supabase free tier (DB, auth, storage)

---

## 📁 Project structure

```
lmajhol/
├── frontend/                 Vite + React + TS + Tailwind + R3F
│   ├── public/
│   │   └── models/founder.glb    ← your GLB avatar
│   └── src/
│       ├── scenes/HeroScene.tsx  ← the 3D scene
│       ├── pages/                ← Home, Shop, ProductDetail, Checkout, Admin...
│       ├── components/           ← Nav, CartDrawer, Footer
│       └── lib/                  ← supabase, cart, order, products
├── netlify/functions/
│   └── telegram-order.mjs        ← forwards orders to Telegram
├── supabase/schema.sql            ← DB tables + RLS + storage bucket
└── netlify.toml
```

---

## 🚀 One-time setup (do this once)

### 1. Supabase project

1. Go to https://supabase.com → New project (free tier)
2. Open **SQL Editor**, paste the entire file `supabase/schema.sql`, click **Run**
3. **Settings → API** → copy `Project URL` and `anon public` key
4. **Authentication → Users → Add user** → create an account with **your email + a strong password**. This will be the admin. Confirm the email.

### 2. Telegram bot

You already have this — you told me. Confirm you have:
- `TELEGRAM_BOT_TOKEN` (from [@BotFather](https://t.me/BotFather) → `/newbot`)
- `TELEGRAM_CHAT_ID` (message [@userinfobot](https://t.me/userinfobot) in Telegram; it replies with your ID)

Test the bot: open `https://t.me/YOUR_BOT_USERNAME` in Telegram and hit **Start** (the bot must be able to message you).

### 3. Local dev

```bash
cd frontend
cp .env.example .env
# fill in: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_EMAIL
npm install
npm run dev
# open http://localhost:5173
```

The Telegram function only runs on Netlify — if you want to test it locally, install Netlify CLI:
```bash
npm i -g netlify-cli
netlify dev
```

### 4. (Recommended) Compress the GLB — from 44 MB to ~2 MB

Your `founder.glb` is 44 MB (500k triangles, 3 raw textures). Mobile users on 4G will wait 30+ seconds. Run this **once** to compress it in place — the site will still look great and load in 2 seconds:

```bash
cd frontend
npm run compress-model
```

This uses [`@gltf-transform/cli`](https://gltf-transform.dev) to:
- Simplify mesh to 40% of triangles (still photorealistic)
- Compress textures to 1024px WebP
- Draco / meshopt geometry compression

If you prefer stronger compression, run:
```bash
npx --yes @gltf-transform/cli optimize public/models/founder.glb public/models/founder.glb \
  --texture-compress webp --texture-size 512 --simplify true --simplify-ratio 0.25
```

### 5. Deploy to Netlify (free)

1. Push the whole `lmajhol/` folder to a GitHub repo
2. On https://app.netlify.com → **Add new site → Import from Git** → pick the repo
3. Netlify auto-detects `netlify.toml`. Base dir: `frontend`, publish: `dist`, build: `npm run build`.
4. **Site settings → Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL`
   - `TELEGRAM_BOT_TOKEN`   *(server-side, NO VITE_ prefix)*
   - `TELEGRAM_CHAT_ID`     *(server-side, NO VITE_ prefix)*
5. Trigger deploy. Done — you're live at `something.netlify.app`.

---

## 🛠 Daily use

### Add / edit a product
1. Go to `https://your-site.netlify.app/admin/login`
2. Sign in with the email you created in Supabase
3. Click **+ Add product**, upload an image, fill fields, Save
4. Toggle **Active** to show/hide from storefront

### Handle an order
1. Customer places order → you get a Telegram DM instantly
2. Same order appears in `/admin` → **Orders** tab
3. Call the customer, arrange delivery
4. Update status in Supabase (or add UI later — the field is already there)

---

## 🎨 Design decisions

- **Fonts**: Instrument Serif (display, italic) + Geist Sans (body) + Geist Mono (labels) — no Inter, no generic SaaS look
- **Palette**: warm bone `#F7F6F3`, near-black ink `#0A0A0A`, muted mist border `#EAEAEA`
- **Motion**: subtle by default (fade + slide 12px, 800ms `cubic-bezier(0.16,1,0.3,1)`); expressive only in the hero 3D scene (low-frequency = allowed to be beautiful, per `design-motion-principles`)
- **3D**: Static founder bust as a *signature element*, not a mascot. Camera dollies from portrait to wide shot as user scrolls. Two floating tee planes on either side (not gimmicky spinning shirts).

---

## 🔒 Security notes

- **Only** your email (in `VITE_ADMIN_EMAIL`) can access `/admin`. All product/order writes are gated by Supabase RLS + client check.
- Telegram credentials **only** live in Netlify server env — never shipped to the browser.
- Supabase anon key is safe to expose (it's designed to be public, RLS enforces access).

---

## 📱 Next steps you might want

- WhatsApp order confirmation (drop-in replacement for Telegram — ask me)
- Bilingual EN/AR toggle
- Wishlist / stock alerts
- Admin: order status update UI (mark shipped / delivered / cancelled)
- Product variants (color × size matrix)
- Google Analytics / Meta Pixel

Just ask.
