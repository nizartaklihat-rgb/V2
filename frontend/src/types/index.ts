export type Product = {
  id: string
  name: string
  slug: string
  price_mad: number
  color: 'black' | 'white'
  description: string
  image_url: string
  gallery_urls: string[] | null
  sizes: string[]
  stock: number
  active: boolean
  created_at: string
}

export type CartItem = {
  product: Product
  size: string
  qty: number
}

export type OrderPayload = {
  customer: {
    full_name: string
    phone: string
    address: string
    city: string
    notes?: string
  }
  items: {
    product_id: string
    name: string
    color: string
    size: string
    qty: number
    unit_price: number
    line_total: number
  }[]
  subtotal_mad: number
  shipping_mad: number
  total_mad: number
  payment_method: 'cash_on_delivery'
  created_at: string
}
