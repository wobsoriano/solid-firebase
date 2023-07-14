import type { FirebaseApp } from 'firebase/app'
import type { Component, JSX } from 'solid-js'
import { createContext } from 'solid-js'

export const FirebaseContext = createContext<FirebaseApp>()

interface Props {
  firebaseApp: FirebaseApp
  children: JSX.Element
}

export const FirebaseProvider: Component<Props> = (props) => {
  return (
    // eslint-disable-next-line solid/reactivity
    <FirebaseContext.Provider value={props.firebaseApp}>
      {props.children}
    </FirebaseContext.Provider>
  )
}
