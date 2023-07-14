import { createComputed, onCleanup } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { onValue } from 'firebase/database'
import type { DatabaseReference } from 'firebase/database'
import { type MaybeAccessor, access } from '../utils'

/**
 * Provides convenience listeners for lists and values
 * stored within the Firebase Realtime Database.
 *
 * @param docRef
 */
export function useDatabase<T = any>(docRef: MaybeAccessor<DatabaseReference>) {
  const [state, setState] = createStore<{
    loading: boolean
    error: Error | null
    data: T | null
  }>({
    loading: true,
    error: null,
    data: null,
  })

  createComputed(() => {
    const close = onValue(
      access(docRef),
      (snapshot) => {
        setState(
          reconcile({
            loading: false,
            data: snapshot.val(),
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

    onCleanup(() => {
      close()
    })
  })

  return state
}
