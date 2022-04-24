import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import type { Component } from 'solid-js'
import { createContext } from 'solid-js'

export const FirebaseContext = createContext<FirebaseApp>()

interface Props {
  config: FirebaseOptions
}

export const FirebaseProvider: Component<Props> = (props) => {
  const app = initializeApp(props.config)

  return <FirebaseContext.Provider value={app}>{props.children}</FirebaseContext.Provider>
}
