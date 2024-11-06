import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics, logEvent } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDIrWiQ2GApX8WM7jV8mdLjkdiMuIBUIhA',
  authDomain: 'hoops-yard.firebaseapp.com',
  databaseURL: 'https://hoops-yard-default-rtdb.firebaseio.com',
  projectId: 'hoops-yard',
  storageBucket: 'hoops-yard.appspot.com',
  messagingSenderId: '29857377160',
  appId: '1:29857377160:web:ac544f20ae84441b65683d',
  measurementId: 'G-N9CPVZ8GCG'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
const analytics = getAnalytics(app)

export const logEv = (name: string, params = undefined) => {
  logEvent(analytics, name, params)
}
