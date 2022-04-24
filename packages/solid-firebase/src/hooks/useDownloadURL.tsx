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
    error: Error | undefined
    data: string | undefined
  }>({
    loading: true,
    error: undefined,
    data: undefined,
  })

  getDownloadURL(storageRef)
    .then((url) => {
      setState(
        reconcile({
          loading: false,
          error: undefined,
          data: url,
        }),
      )
    })
    .catch((error) => {
      setState(
        reconcile({
          loading: false,
          error,
          data: undefined,
        }),
      )
    })

  return state
}
