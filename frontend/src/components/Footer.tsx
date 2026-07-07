export default function Footer() {
  return (
    <footer id="contact" className="border-t border-mist mt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-display italic text-3xl tracking-tightest">LMAJHOL</div>
          <p className="mt-4 text-sm text-smoke leading-relaxed max-w-xs">
            Oversized essentials, cut and shipped from Casablanca. Small runs, honest cotton.
          </p>
        </div>

        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-smoke mb-4">Shop</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/shop" className="hover:opacity-60">All Tees</a></li>
            <li><a href="/product/oversized-black" className="hover:opacity-60">Oversized Black</a></li>
            <li><a href="/product/oversized-white" className="hover:opacity-60">Oversized White</a></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-smoke mb-4">Support</div>
          <ul className="space-y-2 text-sm">
            <li>Cash on delivery</li>
            <li>Shipping across Morocco</li>
            <li>Free returns within 7 days</li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-smoke mb-4">Contact</div>
          <ul className="space-y-2 text-sm">
            <li>Casablanca, MA</li>
            <li>WhatsApp: +212 ••• ••• •••</li>
            <li>lmajhol@store.ma</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-mist">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] font-mono tracking-[0.14em] uppercase text-smoke">
          <div>© {new Date().getFullYear()} LMAJHOL — All rights reserved</div>
          <div>Made in Casablanca</div>
        </div>
      </div>
    </footer>
  )
}
