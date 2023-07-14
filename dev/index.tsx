import { render } from 'solid-js/web'
import { initializeApp } from 'firebase/app'
import { FirebaseProvider } from '../src'
import './styles.css'

import App from './App'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

render(
  () => (
    <FirebaseProvider app={app}>
      <App />
    </FirebaseProvider>
  ),
  document.getElementById('root')!,
)
