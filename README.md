# solid-firebase

Firebase bindings for Solid.

## Quick start

Install it:

```bash
yarn add solid-firebase
```

Configure firebase app:

```tsx
import { render } from 'solid-js/web'
import { FirebaseProvider } from 'solid-firebase'
import App from './App'

const firebaseConfig = {...}

render(
  () => (
    <FirebaseProvider config={config}>
      <App />
    </FirebaseProvider>
  ),
  document.getElementById('root') as HTMLElement,
)
```

## Firebase Authentication

`solid-firebase` provides a convenience listener for Firebase Auth's auth status.

```tsx
import { getAuth } from "firebase/auth";
import { For, Show } from "solid-js";
import { useAuth } from "solid-firebase";

const App = () => {
  const auth = getAuth();
  const { isLoading, isAuthenticated, user } = useAuth(auth);

  return (
    <div>
      <Show when={!isLoading()} fallback={<div>Loading...</div>}>
        <Show when={isAuthenticated()} fallback={<Login />}>
          {user.data?.email}
        </Show>
      </Show>
    </div>
  );
};
```
