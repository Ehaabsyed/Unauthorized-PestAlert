import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Check if critical config is available and valid
const hasFirebaseConfig = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'placeholder-api-key' &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('placeholder')
)

let app: FirebaseApp | null = null
let auth: Auth | null = null
let analytics: Analytics | null = null

try {
  if (hasFirebaseConfig) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
    
    // Initialize analytics only on client side
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app)
        }
      }).catch(err => console.debug('Analytics not supported'))
    }
  } else {
    console.warn('[AgriTech] Firebase config is missing or using placeholders. Auth will run in Demo Mode.')
  }
} catch (e) {
  console.error('[AgriTech] Firebase initialization error:', e)
  app = null
  auth = null
}

export { app, auth, analytics, hasFirebaseConfig }
