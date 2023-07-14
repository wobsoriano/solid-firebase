import type { StorageReference } from 'firebase/storage'
import { getDownloadURL } from 'firebase/storage'
import { createResource } from 'solid-js'
import type { MaybeAccessor } from '../utils'
import { access } from '../utils'

/**
 * Convenience listeners for files stored within Firebase Cloud Storage.
 *
 * @param maybeStorageRef
 */
export function useDownloadURL(maybeStorageRef: MaybeAccessor<StorageReference>) {
  const [data] = createResource(() => access(maybeStorageRef), (storageRef) => {
    return getDownloadURL(storageRef)
  })

  return data
}
