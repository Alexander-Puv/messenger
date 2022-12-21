import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useContext, useState } from 'react'
import { FirebaseContext } from '../MainConf'
import { Enter } from '../components/UI'
import { doc, setDoc } from 'firebase/firestore'

const Login = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const emailLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }
  
  return (
    <Enter
      inputs={[
        {label: 'Email', value: email, onChange: setEmail},
        {label: 'Password', value: password, onChange: setPassword}
      ]}
      confirm={emailLogin}
      gooole={googleLogin}
      error={error}
    />
  )
}

export default Login