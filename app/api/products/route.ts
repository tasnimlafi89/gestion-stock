import { NextResponse } from 'next/server'
import { requireAuthEmail } from '@/app/lib/apiAuth'
import { readAllProducts } from '@/app/action'

export async function GET() {
    const result = await requireAuthEmail()
    if ('error' in result) return result.error

    const products = await readAllProducts()
    return NextResponse.json({ products: products ?? [] })
}