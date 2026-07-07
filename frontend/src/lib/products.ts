import { supabase } from './supabase'
import type { Product } from '../types'

const FALLBACK: Product[] = [
  {
    id: 'demo-black',
    name: 'The Oversized — Black',
    slug: 'oversized-black',
    price_mad: 199,
    color: 'black',
    description:
      '240gsm heavyweight cotton. Boxy fit, dropped shoulder, ribbed collar. Cut in Casablanca. Meant to be worn loose.',
    image_url:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop',
    gallery_urls: null,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 40,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-white',
    name: 'The Oversized — White',
    slug: 'oversized-white',
    price_mad: 199,
    color: 'white',
    description:
      '240gsm heavyweight cotton. Boxy fit, dropped shoulder, ribbed collar. Cut in Casablanca. Meant to be worn loose.',
    image_url:
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=80&auto=format&fit=crop',
    gallery_urls: null,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 40,
    active: true,
    created_at: new Date().toISOString(),
  },
]

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    if (!data || data.length === 0) return FALLBACK
    return data as Product[]
  } catch (e) {
    console.warn('[LMAJHOL] Using fallback products (Supabase not configured yet):', e)
    return FALLBACK
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
    if (error) throw error
    return data as Product
  } catch {
    return FALLBACK.find((p) => p.slug === slug) ?? null
  }
}
