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

## Authentication

Convenience listener for Firebase Auth's auth status.

```tsx
import { Show } from 'solid-js'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useAuth } from 'solid-firebase'

const Login = () => {
  const auth = getAuth()
  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider())

  return <button onClick={signIn}>Sign In with Google</button>
}

const App = () => {
  const auth = getAuth()
  const { isLoading, isAuthenticated, user } = useAuth(auth)

  return (
    <div>
      <Show when={!isLoading()} fallback={<div>Loading...</div>}>
        <Show when={isAuthenticated()} fallback={<Login />}>
          {user.data?.email}
        </Show>
      </Show>
    </div>
  )
}
```

## Firestore

Convenience listener for Collections and Documents stored with Cloud Firestore.

