import type { Auth, User } from 'firebase/auth';
import { createMemo, onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

/**
 * Provides a convenience listener for Firebase Auth's auth state.
 *
 * @param auth
 */
export function useAuth(auth: Auth) {
  const [user, setUser] = createStore<{ data: User | null }>({ data: null });
  const isAuthenticated = createMemo(() => !!user.data);

  const unsub = auth.onIdTokenChanged((authUser) => {
    setUser(
      reconcile({
        data: authUser,
      }),
    );
  });

  onCleanup(unsub);

  return {
    auth,
    user,
    isAuthenticated,
  };
}
