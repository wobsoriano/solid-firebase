import type { StorageReference } from 'firebase/storage'
import { getDownloadURL } from 'firebase/storage'
import { createStore, reconcile } from 'solid-js/store'

/**
 * Convenience listeners for files stored within Firebase Cloud Storage.
 *
 * @param storageRef
 */
export function useDownloadURL(storageRef: StorageReference) {
  const [state, setState] = createStore<{
    loading: boolean
    error: Error | null
    data: string | null
  }>({
    loading: true,
    error: null,
    data: null,
  })

  getDownloadURL(storageRef)
    .then((url) => {
      setState(
        reconcile({
          loading: false,
          error: null,
          data: url,
        }),
      )
    })
    .catch((error) => {
      setState(
        reconcile({
          loading: false,
          error,
          data: null,
        }),
      )
    })

  return state
}
