import type { Auth, User } from 'firebase/auth';
import { onIdTokenChanged } from 'firebase/auth';
import { onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

/**
 * Provides a convenience listener for Firebase Auth's auth state.
 *
 * @param auth
 */
export function useAuth(auth: Auth) {
  const [state, setState] = createStore<{
    loading: boolean;
    data: User | null;
    error: Error | null;
  }>({
    loading: true,
    data: null,
    error: null,
  });

  const unsub = onIdTokenChanged(
    auth,
    (authUser) => {
      setState(
        reconcile({
          loading: false,
          data: authUser,
          error: null,
        }),
      );
    },
    (error) => {
      setState(
        reconcile({
          loading: false,
          data: null,
          error,
        }),
      );
    },
  );

  onCleanup(unsub);

  return state;
}
