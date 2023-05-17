import { Match, Switch } from 'solid-js'
import { collection, getFirestore } from 'firebase/firestore'
import { useFirebaseApp, useFirestore } from '../src'

function App() {
  const app = useFirebaseApp()
  const db = getFirestore(app)
  const notes = useFirestore(collection(db, 'notes'))

  return (
    <Switch>
      <Match when={notes.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={notes.error}>
        <p>An error occurred.</p>
      </Match>
      <Match when={notes.data}>
        { JSON.stringify(notes.data) }
      </Match>
    </Switch>
  )
}

export default App
