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

`useAuth` is a [Firebase Auth](https://firebase.google.com/docs/auth) binding to easily react to changes in the users' authentication status.

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
      <Show when={!isLoading()} fallback={<Loading />}>
        <Show when={isAuthenticated()} fallback={<Login />}>
          {user.data?.email}
        </Show>
      </Show>
    </div>
  )
}
```

## Firestore

`useFirestore` is a [Cloud Firestore](https://firebase.google.com/docs/firestore) binding that makes it straightforward to always keep your local data in sync with remotes databases.

```tsx
import { collection, doc, getFirestore } from 'firebase/firestore'
import { For } from 'solid-js'
import { useFirestore } from 'solid-firebase'

const App = () => {
  const db = getFirestore()
  const todos = useFirestore(collection(db, 'todos'))

  // or for doc reference
  const todo = useFirestore(doc(db, 'todos', 'todo-id'))

  return (
    <For each={todos.data} fallback={<Loading />}>
      {(item) => <div>{item.text}</div>}
    </For>
  )
}
```