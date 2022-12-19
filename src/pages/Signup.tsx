import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { grey } from '@mui/material/colors'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { FirebaseContext } from '../MainConf'
import { Enter } from '../components/UI'

const Signup = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [photoURL, setPhotoURL] = useState('')

  const emailSignup = () => {

  }

  const googleSignup = async () => {
    const provider = new GoogleAuthProvider()
    const {user} = await signInWithPopup(auth, provider)
    
    addDoc(collection(firestore, 'users'), {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      createdAt: serverTimestamp()
    })
  }
  
  return (
    <Enter
      inputs={[
        {label: 'Login', value: displayName, onChange: setDisplayName},
        {label: 'Email', value: email, onChange: setEmail},
        {label: 'Password', value: password, onChange: setPassword},
      ]}
      confirm={emailSignup}
      gooole={googleSignup}
    />
  )
}

export default Signup