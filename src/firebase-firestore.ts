import { app } from '@/firebase'
import {
  writeBatch,
  collection,
  collectionGroup,
  getFirestore,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore'
import type {
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  DocumentReference
} from 'firebase/firestore'
import { recordConverter } from '@/utils/record-converter'
import { productConverter } from '@/utils/product-converter'
import type { Product, ProductDoc, RecordItem } from './types'


// Initialize Firestore
export const db = getFirestore(app)

const productsName = 'products-'
const recordsName = 'records-'
const paymentsName = 'payments-'
const bookingsName = 'bookings-'

export const productsColl = collection(db, productsName)
export const recordsColl = collection(db, recordsName)
export const paymentsCollGroup = collectionGroup(db, paymentsName)
export const bookingsCollGroup = collectionGroup(db, bookingsName)

export const getProductsCollectionSnapShot = async (snapshot: QuerySnapshot) => {
  const products: DocumentData[] = []
  snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    const { id } = doc
    if (id && products.findIndex((p) => p.id === id) === -1) {
      products.push({
        productId: id,
        ...doc.data()
      })
    }
  })
  return products
}

export const getRecordsCollectionSnapShot = async (snapshot: QuerySnapshot) => {
  const recordsIds: string[] = []
  snapshot.forEach((doc) => {
    const recordRef = doc.ref.parent.parent
    const recordId = recordRef?.id
    if (recordId && !recordsIds.includes(recordId)) {
      recordsIds.push(recordId)
    }
  })
  const promises = recordsIds.map((id) => getRecord(id))
  const records = await Promise.all(promises)
  return records.filter(Boolean)
}

export const getRecordsSnapShot = (snapshot: QuerySnapshot) => {
  const results: RecordItem[] = []
  snapshot.forEach(async (doc) => {
    const id = doc.id
    // collections
    const payments = await getCollection(collection(recordsColl, id, paymentsName))
    const bookings = await getCollection(collection(recordsColl, id, bookingsName))
    //
    results.push(
      recordConverter.fromFirestore({
        id,
        payments: payments.filter((p) => p.amount > 0),
        bookings,
        ...doc.data()
      })
    )
  })
  return results
}

export const getCollection = async (colRef: any) => {
  const results: any[] = []
  const snapsShot = await getDocs(colRef)
  snapsShot.forEach((doc: DocumentData) => {
    const row = {
      id: doc.id,
      ...doc.data()
    }
    results.push(row)
  })
  return results
}
export const updateCollection = async (colRef: any, rows: any[] = [], batch = writeBatch(db)) => {
  const snapsShot = await getDocs(colRef)
  rows
    .filter((row: any) => !row.id)
    .forEach((row: any) => {
      batch.set(doc(colRef), row)
    })
  snapsShot.forEach((doc: DocumentData) => {
    const row: any = rows.find((r: any) => r.id === doc.id)
    if (row) {
      delete row.id
      batch.update(doc.ref, row)
    } else {
      batch.delete(doc.ref)
    }
  })
  return batch
}
export const getProductGen = (productsCollName = productsName) => {
  return async (id: string) => {
    const productsColl = collection(db, productsCollName)
    const docRef = doc(productsColl, id)
    const row = await getDoc(docRef)
    if (row.exists()) {
      const productId = row.id
      return productConverter.fromFirestore({
        productId,
        ...(row.data() as ProductDoc)
      })
    } else {
      return null
    }
  }
}
export const saveProductGen = (productsCollName = productsName) => {
  return async (product: Product) => {
    const productsColl = collection(db, productsCollName)
    const payload = productConverter.toFirestore(product)
    const docRef = payload.productId
      ? doc(productsColl, payload.productId as string)
      : doc(productsColl)
    delete payload.productId

    const batch = writeBatch(db)
    batch.set(docRef, payload)
    console.time('saverecord.commit')
    await batch.commit()
    console.timeEnd('saverecord.commit')
    return docRef
  }
}
export const deleteProductGen = (productsCollName = productsName) => {
  const productsColl = collection(db, productsCollName)
  return async (id: string) => {
    const docRef = doc(productsColl, id)
    const batch = writeBatch(db)
    batch.delete(docRef)
    await batch.commit()
  }
}
export const getRecordGen = (
  recordsCollName = recordsName,
  paymentsCollName = paymentsName,
  bookingsCollName = bookingsName
) => {
  return async (id: string) => {
    const recordsColl = collection(db, recordsCollName)
    const docRef = doc(recordsColl, id)
    const row = await getDoc(docRef)
    if (row.exists()) {
      const id = row.id
      // collections
      const payments = await getCollection(collection(recordsColl, id, paymentsCollName))
      const bookings = await getCollection(collection(recordsColl, id, bookingsCollName))
      //
      return recordConverter.fromFirestore({
        id,
        payments: payments.filter((p) => p.amount > 0),
        bookings,
        ...row.data()
      })
    } else {
      return null
    }
  }
}
export const saveRecordGen = (
  recordsCollName = recordsName,
  paymentsCollName = paymentsName,
  bookingsCollName = bookingsName
) => {
  return async (record: any) => {
    const recordsColl = collection(db, recordsCollName)
    const payload = recordConverter.toFirestore(record)
    const payments = payload.payments
    const bookings = payload.bookings
    delete payload.payments
    delete payload.bookings
    const docRef: DocumentReference = payload.id
      ? doc(recordsColl, payload.id as string)
      : doc(recordsColl)
    delete payload.id

    const batch = writeBatch(db)
    batch.set(docRef, payload)
    // update payments/bookings
    const paymentsColl = collection(recordsColl, docRef.id, paymentsCollName)
    await updateCollection(paymentsColl, payments as [], batch)
    const bookingsColl = collection(recordsColl, docRef.id, bookingsCollName)
    await updateCollection(bookingsColl, bookings as [], batch)
    // commit batch
    console.time('saverecord.commit')
    await batch.commit()
    console.timeEnd('saverecord.commit')
    return docRef
  }
}
export const deleteRecordGen = (
  recordsCollName = recordsName,
  paymentsCollName = paymentsName,
  bookingsCollName = bookingsName
) => {
  const recordsColl = collection(db, recordsCollName)
  return async (id: string) => {
    const docRef: DocumentReference = doc(recordsColl, id)

    const batch = writeBatch(db)
    await updateCollection(collection(recordsColl, docRef.id, paymentsCollName), [], batch)
    await updateCollection(collection(recordsColl, docRef.id, bookingsCollName), [], batch)
    batch.delete(docRef)
    await batch.commit()
  }
}
export const getProduct = getProductGen()
export const saveProduct = saveProductGen()
export const deleteProduct = deleteProductGen()
export const getRecord = getRecordGen()
export const saveRecord = saveRecordGen()
export const deleteRecord = deleteRecordGen()
