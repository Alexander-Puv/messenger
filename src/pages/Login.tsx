import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { grey } from '@mui/material/colors'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useContext, useState } from 'react'
import { FirebaseContext } from '../MainConf'
import { Enter } from '../components/UI'

const Login = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')

  const emailLogin = () => {

  }

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider()
    const {user} = await signInWithPopup(auth, provider)
  }
  
  return (
    <Enter
      inputs={[
        {label: 'Login', value: displayName, onChange: setDisplayName},
        {label: 'Password', value: password, onChange: setPassword}
      ]}
      confirm={emailLogin}
      gooole={googleLogin}
    />
  )
}

export default Login