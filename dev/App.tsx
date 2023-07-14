import { Match, Switch, createMemo, createSignal } from 'solid-js'
import { doc, getFirestore } from 'firebase/firestore'
import { useFirebaseApp, useFirestoreOnce } from '../src'

function App() {
  const app = useFirebaseApp()
  const db = getFirestore(app)
  // const notes = useFirestore(collection(db, 'notes'))
  const [noteId, setNoteId] = createSignal('3HfgcVNvO4n1AF2uCpLn')
  const docComputed = createMemo(() => doc(db, 'notes', noteId()))
  const note = useFirestoreOnce(docComputed)

  return (
    <>
      <Switch>
        <Match when={note.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={note.error}>
          <p>An error occurred.</p>
        </Match>
        <Match when={note()}>
          <p>{note()?.title}</p>
        </Match>
      </Switch>
      <button onClick={() => {
        setNoteId('iph4e7XEyL2ryIHOfl9w')
      }}>Update doc id</button>
    </>
  )
}

export default App
