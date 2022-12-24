import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useContext, useState } from 'react'
import { FirebaseContext } from '../MainConf'
import { Enter } from '../components/UI'

const Login = () => {
  const {auth} = useContext(FirebaseContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const emailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(true)
    }
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