/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed } from 'vue'
import type { Ref } from 'vue'
import { productsColl } from '@/firebase-firestore.js'
import { useFirestore } from '@vueuse/firebase/useFirestore'
import { productConverter } from '@/utils/product-converter'
import { db } from '@/firebase-firestore.js'
import { doc, writeBatch, type DocumentData } from 'firebase/firestore'
import type { Product } from '@/types'

const coll = productsColl.withConverter(productConverter)

export default function useCompetitionsLib() {
  const rows: Ref<DocumentData[] | undefined> = useFirestore(coll, undefined)

  const isReady = computed(() => Array.isArray(rows.value))

  const get = (productId: string): Product | undefined => {
    return rows.value?.find((row: DocumentData) => row.productId === productId) as
      | Product
      | undefined
  }
  /* 
  const add = async (payload: CompetitionDoc) => {
    const batch = writeBatch(db)
    // doc
    const compRef = doc(coll)
    batch.set(compRef, payload)
    // commit all
    console.time('write.commit')
    await batch.commit()
    console.timeEnd('write.commit')
  }
     */

  return {
    rows,
    isReady,

    get
    // add
  }
}
