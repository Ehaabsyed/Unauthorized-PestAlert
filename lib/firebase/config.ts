import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { Auth, getAuth } from 'firebase/auth'
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyD1UHgL4uCMLHLIDvoBmVP52ykxnqEYLOc",
  authDomain: "agritech-sentinel.firebaseapp.com",
  projectId: "agritech-sentinel",
  storageBucket: "agritech-sentinel.firebasestorage.app",
  messagingSenderId: "1054982234674",
  appId: "1:1054982234674:web:ee8d8a568aebf0fae1522b",
  measurementId: "G-8JS6XQD2EP"
}

const hasFirebaseConfig = true

let app: FirebaseApp | null = null
let auth: Auth | null = null
let analytics: Analytics | null = null

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  auth = getAuth(app)
  
  // Initialize analytics only on client side
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app)
      }
    })
  }
} catch (e) {
  console.warn('[AgriTech] Firebase initialization failed:', e)
  app = null
  auth = null
}

export { app, auth, analytics, hasFirebaseConfig }
