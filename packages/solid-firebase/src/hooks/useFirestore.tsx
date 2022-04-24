import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  Query,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore'
import { onCleanup } from 'solid-js'
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

interface UseFireStoreReturn<T> {
  data: T
  loading: boolean
  error: FirestoreError | null
}

export function useFirestore<T extends DocumentData>(
  docRef: DocumentReference<T>,
  initialValue: T,
): UseFireStoreReturn<T | null>
export function useFirestore<T extends DocumentData>(
  docRef: Query<T>,
  initialValue: T[],
): UseFireStoreReturn<T[]>

// nullable initial values
export function useFirestore<T extends DocumentData>(
  docRef: DocumentReference<T>,
  initialValue?: T | undefined,
): UseFireStoreReturn<T | undefined | null>
export function useFirestore<T extends DocumentData>(
  docRef: Query<T>,
  initialValue?: T[],
): UseFireStoreReturn<T[] | undefined>

/**
 * Provides convenience listeners for Collections and
 * Documents stored with Cloud Firestore.
 *
 * @param docRef
 * @param initialValue
 */
export function useFirestore<T extends DocumentData>(
  docRef: FirebaseDocRef<T>,
  initialValue: any = undefined,
) {
  if (isDocumentReference<T>(docRef)) {
    const [state, setState] = createStore<UseFireStoreReturn<T | null>>({
      data: initialValue,
      loading: true,
      error: null,
    })

    const close = onSnapshot(
      docRef,
      (snapshot) => {
        setState(
          reconcile({
            loading: false,
            data: getData(snapshot) || null,
          }),
        )
      },
      (error) => {
        setState(
          reconcile({
            loading: false,
            error,
          }),
        )
      },
    )

    onCleanup(() => {
      close()
    })

    return state
  }

  const [state, setState] = createStore({
    data: initialValue,
    loading: true,
    error: null as FirestoreError | null,
  })

  const close = onSnapshot(
    docRef,
    (querySnapshot) => {
      setState(
        reconcile({
          loading: false,
          data: querySnapshot.docs.map(getData).filter(isDefined),
        }),
      )
    },
    (error) => {
      setState(
        reconcile({
          loading: false,
          error,
        }),
      )
    },
  )

  onCleanup(() => {
    close()
  })

  return state
}
