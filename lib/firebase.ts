import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig).filter(([, value]) => !value).map(([key]) => key)
if (missing.length) throw new Error(`Firebase não configurado. Campos ausentes: ${missing.join(', ')}`)

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const firestore = getFirestore(firebaseApp)
