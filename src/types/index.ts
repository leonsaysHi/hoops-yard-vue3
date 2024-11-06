import type { Interval } from 'date-fns'

export interface ProductDoc {
  productId?: string
  categorieId: string
  productName: string
  amountDefault?: number
  shopCategorie?: string
  bookingAmounts?: string
  defaultBookingsView?: boolean
  redirect?: string
  // inactive?: boolean
}
export interface Product extends Omit<ProductDoc, 'bookingAmounts'> {
  productId: string
  shortName?: string
  bookingAmounts?: number[]
}

export interface Categorie {
  id: string
  name: string
  hasBookings?: string
  hasQty?: boolean
  hasPayments?: boolean
  adminOnly?: boolean
}
export interface ShopCategorie {
  id: string
  name: string
}
export type AccessItem = 'team' | 'admin'

export interface RecordDoc {
  id?: string
  title?: string
  comment?: string
  dateCreated: Date
  dateStart: Date
  dateEnd: Date
  categorieId: string
  productId?: string
  qty?: number
  amount?: number
  isPaid: boolean
  //
  product?: Product
}
export interface RecordSummary {
  title?: string
  amount: number
  categorieId: string
  productId?: string
  product?: Product
  dateStart: Date
  dateEnd: Date
  minutes?: number
  interval?: Interval
}

export interface RecordItem extends RecordDoc {
  payments?: []
  bookings?: []
}

export type Sport = 'volley' | 'basket'
export interface Booking {
  id?: number
  dateCreated: Date
  dateEnd: Date
  dateStart: Date
  productId: string
  product?: Product
  scoreboard: boolean
  sport: Sport
  record: RecordSummary
  recordId?: number
}

export type PaidWith = 'cash' | 'yappy' | 'card'
export interface Payment {
  id?: number
  amount: number
  dateCreated: Date
  paidWith: PaidWith
  record: RecordSummary
  recordId?: number
}
