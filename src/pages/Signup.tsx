import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithPopup, updateProfile } from 'firebase/auth'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { FirebaseContext } from '../MainConf'
import { Enter } from '../components/UI'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
// import userIcon from '../assets/userIcon.png'

const Signup = () => {
  const {auth, firestore, storage} = useContext(FirebaseContext)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // const fetchPhoto = (photoUrl: string, uid: string, changeDocs: (url: string) => void) => {
  //   fetch(photoUrl)
  //     .then(response => response.blob())
  //     .then(async blob => {
  //       const photoRef = ref(storage, `userPhoto/${uid}`)
  //       await uploadBytes(photoRef, blob)
  //       await getDownloadURL(photoRef).then(url => {
  //         console.log(url);
  //         changeDocs(url)
  //       })
  //     })
  // }

  const emailSignup = async () => {
    const auth = getAuth();

    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, {displayName})
    
      // const changeDocs = async (photoURL: string) => {
      //   await updateProfile(user, {photoURL})

      await addDoc(collection(firestore, 'users'), {
        uid: user.uid,
        displayName,
        email,
        photoURL: null,
        createdAt: serverTimestamp()
      })
  
      await setDoc(doc(firestore, 'userChats', user.uid), {})
      // }
      // fetchPhoto(userIcon, user.uid, changeDocs)
    } catch (e) {
      console.log(e);
      setError(true)
    }
  }

  const googleSignup = async () => {
    const provider = new GoogleAuthProvider()
    const {user} = await signInWithPopup(auth, provider)

    // const changeDocs = async (photoURL: string) => {
    await addDoc(collection(firestore, 'users'), {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      createdAt: serverTimestamp()
    })
  
    await setDoc(doc(firestore, 'userChats', user.uid), {})
    // }

    // user.photoURL ? fetchPhoto(user.photoURL, user.uid, changeDocs)
    // : fetchPhoto(userIcon, user.uid, changeDocs)
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