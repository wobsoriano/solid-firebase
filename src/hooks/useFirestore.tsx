import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  Query,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore'
import type { Accessor } from 'solid-js'
import { createComputed, onCleanup } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'

export type FirebaseDocRef<T> = Query<T> | DocumentReference<T>

function getData<T>(docRef: DocumentSnapshot<T> | QueryDocumentSnapshot<T>) {
  const data = docRef.data()

  if (data) {
    Object.defineProperty(data, 'id', {
      value: docRef.id.toString(),
      writable: false,
    })
  }

  return data
}

function isDocumentReference<T>(docRef: any): docRef is DocumentReference<T> {
  return (docRef.path?.match(/\//g) || []).length % 2 !== 0
}

function isDefined<T = any>(val?: T): val is T {
  return typeof val !== 'undefined'
}

type MaybeAccessor<T> = T | Accessor<T>
type MaybeAccessorValue<T extends MaybeAccessor<any>> = T extends () => any
  ? ReturnType<T>
  : T

function access<T extends MaybeAccessor<any>>(v: T): MaybeAccessorValue<T> {
  return typeof v === 'function' && !v.length ? v() : v
}

interface UseFireStoreReturn<T> {
  data: T
  loading: boolean
  error: FirestoreError | null
}

export function useFirestore<T extends DocumentData>(
  docRef: MaybeAccessor<DocumentReference<T>>,
  initialValue: T
): UseFireStoreReturn<T | null>
export function useFirestore<T extends DocumentData>(
  docRef: MaybeAccessor<Query<T>>,
  initialValue: T[]
): UseFireStoreReturn<T[]>

// nullable initial values
export function useFirestore<T extends DocumentData>(
  docRef: MaybeAccessor<DocumentReference<T>>,
  initialValue?: T | undefined
): UseFireStoreReturn<T | undefined | null>
export function useFirestore<T extends DocumentData>(
  docRef: MaybeAccessor<Query<T>>,
  initialValue?: T[]
): UseFireStoreReturn<T[] | undefined>

/**
 * Provides convenience listeners for Collections and
 * Documents stored with Cloud Firestore.
 *
 * @param docRef
 * @param initialValue
 */
export function useFirestore<T extends DocumentData>(
  docRef: MaybeAccessor<FirebaseDocRef<T>>,
  initialValue: any = undefined,
) {
  const [state, setState] = createStore<UseFireStoreReturn<T | T[] | null>>({
    data: initialValue,
    loading: true,
    error: null,
  })

  createComputed(() => {
    let close: () => void

    setState('loading', true)
    setState('error', null)

    if (isDocumentReference<T>(access(docRef))) {
      close = onSnapshot(
        access(docRef) as DocumentReference<T>,
        (snapshot) => {
          setState(
            reconcile({
              loading: false,
              data: getData(snapshot) || null,
              error: null,
            }),
          )
        },
        (error) => {
          setState(
            reconcile({
              loading: false,
              data: null,
              error,
            }),
          )
        },
      )
    }
    else {
      close = onSnapshot(
        access(docRef) as Query<T>,
        (querySnapshot) => {
          setState(
            reconcile({
              loading: false,
              data: querySnapshot.docs.map(getData).filter(isDefined),
              error: null,
            }),
          )
        },
        (error) => {
          setState(
            reconcile({
              loading: false,
              data: null,
              error,
            }),
          )
        },
      )
    }

    onCleanup(() => {
      close()
    })
  })

  return state
}
