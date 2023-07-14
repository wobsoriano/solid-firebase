import { useContext } from 'solid-js'
import { FirebaseContext } from '../FirebaseProvider'

export function useFirebaseApp() {
  const app = useContext(FirebaseContext)

  if (!app) {
    throw new Error(
      'useFirebaseApp must be used within a <FirebaseContext.Provider />',
    )
  }

  return app
}
