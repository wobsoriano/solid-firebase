import type { Auth, User } from 'firebase/auth';
import { createMemo, onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

export function useAuth(auth: Auth) {
  const [user, setUser] = createStore<User | Partial<User>>({});
  const isAuthenticated = createMemo(() => !!Object.keys(user).length);

  const unsub = auth.onIdTokenChanged((authUser) => {
    setUser(reconcile(authUser || {}));
  });

  onCleanup(unsub);

  return {
    auth,
    user,
    isAuthenticated,
  };
}
