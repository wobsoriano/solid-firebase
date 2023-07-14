import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { getDoc, getDocs } from 'firebase/firestore'
import type { InitializedResource } from 'solid-js'
import { createResource } from 'solid-js'
import type { MaybeAccessor } from '../utils'
import { access, isDefined, isDocumentReference } from '../utils'

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

type UseFireStoreOnceReturn<T> = InitializedResource<T>

type Falsy = false | 0 | '' | null | undefined

export function useFirestoreOnce<T extends DocumentData>(
  maybeDocRef: MaybeAccessor<DocumentReference<T> | Falsy>,
  initialValue: T
): UseFireStoreOnceReturn<T | null>
export function useFirestoreOnce<T extends DocumentData>(
  maybeDocRef: MaybeAccessor<Query<T> | Falsy>,
  initialValue: T[]
): UseFireStoreOnceReturn<T[]>

// nullable initial values
export function useFirestoreOnce<T extends DocumentData>(
  maybeDocRef: MaybeAccessor<DocumentReference<T> | Falsy>,
  initialValue?: T | undefined | null
): UseFireStoreOnceReturn<T | undefined | null>
export function useFirestoreOnce<T extends DocumentData>(
  maybeDocRef: MaybeAccessor<Query<T> | Falsy>,
  initialValue?: T[]
): UseFireStoreOnceReturn<T[] | undefined>

/**
 * Provides convenience listeners for Collections and
 * Documents stored with Cloud Firestore.
 *
 * @param maybeDocRef
 * @param initialValue
 */
export function useFirestoreOnce<T extends DocumentData>(
  maybeDocRef: MaybeAccessor<FirebaseDocRef<T> | Falsy>,
  initialValue: any = undefined,
) {
  const [data] = createResource(() => access(maybeDocRef), async (docRef) => {
    if (isDocumentReference<T>(docRef)) {
      const snapshot = await getDoc(docRef)
      return getData(snapshot) || null
    }

    const querySnapshot = await getDocs(docRef as Query<T>)
    return querySnapshot.docs.map(getData).filter(isDefined)
  }, { initialValue })

  return data
}
