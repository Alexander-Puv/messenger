import { Experimental_CssVarsProvider as MUIThemes } from '@mui/material'
import { FirebaseApp, initializeApp } from "firebase/app"
import { Auth, getAuth } from "firebase/auth"
import { Database, getDatabase } from "firebase/database"
import { Firestore, getFirestore } from "firebase/firestore"
import { createContext } from 'react'
import App from './App'
import { FirebaseStorage, getStorage } from 'firebase/storage'

const app = initializeApp({
  apiKey: "AIzaSyBoNCV_Y8COx2hhOwaiTAf3LhzxlM-VxMU",
  authDomain: "react-chat-661b4.firebaseapp.com",
  projectId: "react-chat-661b4",
  storageBucket: "react-chat-661b4.appspot.com",
  messagingSenderId: "1015109380610",
  appId: "1:1015109380610:web:cd46fd8544b8c34754551b",
  measurementId: "G-NT0YS3FQ98"
})
const firestore = getFirestore(app)
const auth = getAuth(app)
const database = getDatabase();
const storage = getStorage();

interface FirebaseContextProps {
  app: FirebaseApp,
  firestore: Firestore,
  auth: Auth,
  database: Database,
  storage: FirebaseStorage
}

export const FirebaseContext = createContext<FirebaseContextProps>({app, firestore, auth, database, storage})

const MainConf = () => {
  return (
    <MUIThemes defaultMode="dark">
      <FirebaseContext.Provider value={{
        app, firestore, auth, database, storage
      }}>
        <App />
      </FirebaseContext.Provider>
    </MUIThemes>
  )
}

export default MainConf