import { useContext } from 'solid-js'
import { FirebaseContext } from '../FirebaseProvider'

export const useFirebaseApp = () => {
  const ctx = useContext(FirebaseContext)

  if (!ctx)
    throw new Error('useFirebaseApp must be used within a <FirebaseContext.Provider />')

  return ctx
}
