import type { ProductDoc } from '@/types'
import { checkNumber } from '@/utils/utils'

export const productConverter = {
  toFirestore: (row: any) => {
    const payload = {
      ...row,
      amountDefault: row.amountDefault ? checkNumber(row.amountDefault) : undefined
    }
    return Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null))
  },
  fromFirestore: (row: ProductDoc) => {
    const amountDefault = checkNumber(row.amountDefault)
    //
    return {
      ...row,
      ...(amountDefault ? { amountDefault } : {})
    }
  }
}
