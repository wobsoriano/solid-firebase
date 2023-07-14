import type {
  DocumentData,
  DocumentReference,
  FirestoreError,
  Query,
} from 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore'
import { createComputed, onCleanup } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import type { FirebaseDocRef, MaybeAccessor } from '../utils'
import { access, getData, isDefined, isDocumentReference } from '../utils'

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
 * Retrive and monitor value of Collections and
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
