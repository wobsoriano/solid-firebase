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

## Authentication

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
    <Switch fallback={<User data={state.data} />}>
      <Match when={state.loading}>
        <div>Loading...</div>
      </Match>
      <Match when={state.error}>
        <Login />
      </Match>
    </Switch>
  )
}
```

## Cloud Firestore

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
    <Switch fallback={<TodoList data={todos.data}>}>
      <Match when={todos.loading}>
        <div>Loading...</div>
      </Match>
      <Match when={todos.error}>
        <div>An error occurred.</div>
      </Match>
    </Switch>
  )
}
```

## Cloud Storage

`useDownloadURL` is a hook that wraps the [getDownloadURL](https://firebase.google.com/docs/storage/web/download-files#download_data_via_url) method of [Cloud Storage](https://firebase.google.com/docs/storage).

```tsx
import { Match, Switch } from 'solid-js'
import { getStorage, ref } from 'firebase/storage'
import { useDownloadURL } from 'solid-firebase'

const App = () => {
  const storage = getStorage()
  const screenshotRef = ref(
    storage,
    'images/yourimage.jpg',
  )
  const state = useDownloadURL(screenshotRef)

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