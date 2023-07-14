<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-firebase&background=tiles&project=%20" alt="solid-firebase">
</p>

# solid-firebase

Solid primitives for Firebase.

> ⚠️ This package only works with [Firebase 9 or above with the modular style](https://firebase.google.com/docs/web/modular-upgrade).

## Quick start

Install it:

```bash
npm install firebase solid-firebase
```

Configure firebase app:

```tsx
import { render } from 'solid-js/web'
import { initializeApp } from 'firebase/app'
import { FirebaseProvider } from 'solid-firebase'
import App from './App'

const app = initializeApp({ projectId: 'MY PROJECT ID' })

render(
  () => (
    <FirebaseProvider config={app}>
      <App />
    </FirebaseProvider>
  ),
  document.getElementById('root'),
)
```

## Primitives

The primitive [useFirebaseApp](https://github.com/wobsoriano/solid-firebase/blob/master/packages/lib/src/hooks/useFirebaseApp.tsx) gives you access to the initialized firebase app.

### Authentication

[useAuth](https://github.com/wobsoriano/solid-firebase/blob/master/packages/lib/src/hooks/useAuth.tsx) is a [Firebase Auth](https://firebase.google.com/docs/auth) binding to easily react to changes in the users' authentication status.

```tsx
import { Match, Switch } from 'solid-js'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useAuth, useFirebaseApp } from 'solid-firebase'

function Login() {
  const app = useFirebaseApp()
  const signIn = () => signInWithPopup(getAuth(app), new GoogleAuthProvider())

  return <button onClick={signIn}>Sign In with Google</button>
}

function App() {
  const app = useFirebaseApp()
  const state = useAuth(getAuth(app))

  return (
    <Switch>
      <Match when={state.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={state.error}>
        <Login />
      </Match>
      <Match when={state.data}>
        <User data={state.data} />
      </Match>
    </Switch>
  )
}
```

### Cloud Firestore

[useFirestore](https://github.com/wobsoriano/solid-firebase/blob/master/packages/lib/src/hooks/useFirestore.tsx) is a [Cloud Firestore](https://firebase.google.com/docs/firestore) binding that makes it straightforward to always keep your local data in sync with remotes databases.

```tsx
import { Match, Switch } from 'solid-js'
import { collection, getFirestore } from 'firebase/firestore'
import { useFirebaseApp, useFirestore } from 'solid-firebase'

function App() {
  const app = useFirebaseApp()
  const db = getFirestore(app)
  const todos = useFirestore(collection(db, 'todos'))

  // or for doc reference
  const todo = useFirestore(doc(db, 'todos', 'todo-id'))

  return (
    <Switch>
      <Match when={todos.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={todos.error}>
        <p>An error occurred.</p>
      </Match>
      <Match when={todos.data}>
        <TodoList data={todos.data} />
      </Match>
    </Switch>
  )
}
```

### Realtime Database

[useDatabase](https://github.com/wobsoriano/solid-firebase/blob/master/packages/lib/src/hooks/useDatabase.tsx) is a [Realtime Database](https://firebase.google.com/docs/database) binding that makes it straightforward to always keep your local data in sync with remotes databases.

```tsx
import { Match, Switch } from 'solid-js'
import { getDatabase, ref } from 'firebase/database'
import { useDatabase, useFirebaseApp } from 'solid-firebase'

function App() {
  const app = useFirebaseApp()
  const db = getDatabase(app)
  const todos = useDatabase(ref(db, 'todos'))

  return (
    <Switch>
      <Match when={todos.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={todos.error}>
        <p>An error occurred.</p>
      </Match>
      <Match when={todos.data}>
        <TodoList data={todos.data} />
      </Match>
    </Switch>
  )
}
```

### Cloud Storage

[useDownloadURL](https://github.com/wobsoriano/solid-firebase/blob/master/packages/lib/src/hooks/useDownloadURL.tsx) is a hook that wraps the [getDownloadURL](https://firebase.google.com/docs/storage/web/download-files#download_data_via_url) method of [Cloud Storage](https://firebase.google.com/docs/storage).

```tsx
import { Match, Switch } from 'solid-js'
import { getStorage, ref } from 'firebase/storage'
import { useDownloadURL, useFirebaseApp } from 'solid-firebase'

function App() {
  const app = useFirebaseApp()
  const storage = getStorage(app)
  const state = useDownloadURL(ref(
    storage,
    'images/yourimage.jpg',
  ))

  return (
    <Switch>
      <Match when={state.loading}>
        <p>Download URL: Loading...</p>
      </Match>
      <Match when={state.error}>
        <p>Error: {state.error?.name}</p>
      </Match>
      <Match when={state.data}>
        <img src={state.data} alt="pic" />
      </Match>
    </Switch>
  )
}
```

## License

MIT
