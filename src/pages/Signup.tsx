import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithPopup, updateProfile } from 'firebase/auth'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { FirebaseContext } from '../MainConf'
import { Enter } from '../components/UI'

const Signup = () => {
  const {auth, firestore, storage} = useContext(FirebaseContext)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const emailSignup = async () => {
    const auth = getAuth();

    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, {displayName})

      await addDoc(collection(firestore, 'users'), {
        uid: user.uid,
        displayName,
        displayNameLowercase: displayName.toLowerCase(), 
        email,
        photoURL: null,
        createdAt: serverTimestamp()
      })
  
      await setDoc(doc(firestore, 'userChats', user.uid), {})
    } catch (e) {
      console.log(e);
      setError(true)
    }
  }

  const googleSignup = async () => {
    const provider = new GoogleAuthProvider()
    const {user} = await signInWithPopup(auth, provider)

    await addDoc(collection(firestore, 'users'), {
      uid: user.uid,
      displayName: user.displayName,
      displayNameLowercase: user.displayName?.toLowerCase(), 
      photoURL: user.photoURL,
      email: user.email,
      createdAt: serverTimestamp()
    })
  
    await setDoc(doc(firestore, 'userChats', user.uid), {})
  }
  
  return (
    <Enter
      inputs={[
        {label: 'Display name', value: displayName, onChange: setDisplayName},
        {label: 'Email', value: email, onChange: setEmail},
        {label: 'Password', value: password, onChange: setPassword},
      ]}
      confirm={emailSignup}
      gooole={googleSignup}
      error={error}
    />
  )
}

export default Signup