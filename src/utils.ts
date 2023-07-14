import type { DocumentReference, DocumentSnapshot, Query, QueryDocumentSnapshot } from 'firebase/firestore'
import type { Accessor } from 'solid-js'

export type MaybeAccessor<T> = T | Accessor<T>
export type MaybeAccessorValue<T extends MaybeAccessor<any>> = T extends () => any
  ? ReturnType<T>
  : T

export function isDocumentReference<T>(docRef: any): docRef is DocumentReference<T> {
  return (docRef.path?.match(/\//g) || []).length % 2 !== 0
}

export function isDefined<T = any>(val?: T): val is T {
  return typeof val !== 'undefined'
}

export function access<T extends MaybeAccessor<any>>(v: T): MaybeAccessorValue<T> {
  return typeof v === 'function' && !v.length ? v() : v
}

export function getData<T>(docRef: DocumentSnapshot<T> | QueryDocumentSnapshot<T>) {
  const data = docRef.data()

  if (data) {
    Object.defineProperty(data, 'id', {
      value: docRef.id.toString(),
      writable: false,
    })
  }

  return data
}

export type FirebaseDocRef<T> = Query<T> | DocumentReference<T>

export type Falsy = false | 0 | '' | null | undefined
