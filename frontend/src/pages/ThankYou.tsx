import { Link } from 'react-router-dom'

export default function ThankYou() {
  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 md:px-10 text-center">
        <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-smoke mb-3">
          Order confirmed
        </div>
        <h1 className="font-display italic text-5xl md:text-7xl tracking-tightest leading-[0.95]">
          Thank you.
        </h1>
        <p className="mt-8 text-lg text-smoke leading-relaxed">
          We received your order. We will call you shortly on the phone number you provided to confirm shipping details.
          Payment is due in cash to the courier on delivery.
        </p>
        <div className="mt-12 flex justify-center gap-4">
          <Link to="/" className="btn-primary">Back home</Link>
          <Link to="/shop" className="btn-ghost">Keep browsing</Link>
        </div>
      </div>
    </main>
  )
}
