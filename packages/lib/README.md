# solid-firebase

Solid hooks for Firebase.

## Quick start

Install it:

```bash
yarn add firebase solid-firebase
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

## Hooks

### Authentication

`useAuth` is a [Firebase Auth](https://firebase.google.com/docs/auth) binding to easily react to changes in the users' authentication status.

```tsx
import { Switch, Match } from 'solid-js'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useAuth } from 'solid-firebase'

const Login = () => {
  const auth = getAuth()
  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider())

  return <button onClick={signIn}>Sign In with Google</button>
}

const App = () => {
  const auth = getAuth()
  const state = useAuth(auth)

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

`useFirestore` is a [Cloud Firestore](https://firebase.google.com/docs/firestore) binding that makes it straightforward to always keep your local data in sync with remotes databases.

```tsx
import { Match, Switch } from 'solid-js'
import { collection, getFirestore } from 'firebase/firestore'
import { useFirestore } from 'solid-firebase'

const App = () => {
  const db = getFirestore()
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

`useDatabase` is a [Realtime Database](https://firebase.google.com/docs/database) binding that makes it straightforward to always keep your local data in sync with remotes databases.

```tsx
import { Match, Switch } from 'solid-js'
import { getDatabase, ref } from 'firebase/database'
import { useDatabase } from 'solid-firebase'

const App = () => {
  const db = getDatabase()
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

`useDownloadURL` is a hook that wraps the [getDownloadURL](https://firebase.google.com/docs/storage/web/download-files#download_data_via_url) method of [Cloud Storage](https://firebase.google.com/docs/storage).

```tsx
import { Match, Switch } from 'solid-js'
import { getStorage, ref } from 'firebase/storage'
import { useDownloadURL } from 'solid-firebase'

const App = () => {
  const storage = getStorage()
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

MIT License © 2022 [Robert Soriano](https://github.com/wobsoriano)