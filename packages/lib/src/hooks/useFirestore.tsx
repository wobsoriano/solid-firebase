import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

export interface FirestoreOptions {
  errorHandler?: (err: Error) => void;
}

export type FirebaseDocRef<T> = Query<T> | DocumentReference<T>;

function getData<T>(docRef: DocumentSnapshot<T> | QueryDocumentSnapshot<T>) {
  const data = docRef.data();

  if (data) {
    Object.defineProperty(data, 'id', {
      value: docRef.id.toString(),
      writable: false,
    });
  }

  return data;
}

function isDocumentReference<T>(docRef: any): docRef is DocumentReference<T> {
  return (docRef.path?.match(/\//g) || []).length % 2 !== 0;
}

function isDefined<T = any>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function useFirestore<T extends DocumentData>(
  docRef: DocumentReference<T>,
  initialValue: T,
  options?: FirestoreOptions,
): { data: T | null };
export function useFirestore<T extends DocumentData>(
  docRef: Query<T>,
  initialValue: T[],
  options?: FirestoreOptions,
): { data: T[] };

// nullable initial values
export function useFirestore<T extends DocumentData>(
  docRef: DocumentReference<T>,
  initialValue?: T | undefined,
  options?: FirestoreOptions,
): { data: T | undefined | null };
export function useFirestore<T extends DocumentData>(
  docRef: Query<T>,
  initialValue?: T[],
  options?: FirestoreOptions,
): { data: T[] | undefined };

/**
 * Provides convenience listeners for Collections
 * and Documents stored with Cloud Firestore.
 *
 * @param docRef
 * @param initialValue
 * @param options
 */
export function useFirestore<T extends DocumentData>(
  docRef: FirebaseDocRef<T>,
  initialValue: any = undefined,
  options: FirestoreOptions = {},
) {
  const { errorHandler = (err: Error) => console.error(err) } = options;

  if (isDocumentReference<T>(docRef)) {
    const [data, setData] = createStore<{ data: T | null | undefined }>({
      data: initialValue,
    });

    const close = onSnapshot(
      docRef,
      (snapshot) => {
        setData(
          reconcile({
            data: getData(snapshot) || null,
          }),
        );
      },
      errorHandler,
    );

    onCleanup(() => {
      close();
    });

    return data;
  }

  const [data, setData] = createStore<{ data: T[] | undefined }>({
    data: initialValue,
  });

  const close = onSnapshot(
    docRef,
    (querySnapshot) => {
      setData(
        reconcile({
          data: querySnapshot.docs.map(getData).filter(isDefined),
        }),
      );
    },
    errorHandler,
  );

  onCleanup(() => {
    close();
  });

  return data;
}
