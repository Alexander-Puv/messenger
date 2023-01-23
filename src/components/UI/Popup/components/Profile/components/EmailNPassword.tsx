import ContactMailIcon from '@mui/icons-material/ContactMail';
import KeyIcon from '@mui/icons-material/Key';
import { TextField } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import { FirebaseError } from 'firebase/app';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListInputItem, Popup } from '../../../..';
import { FirebaseContext } from '../../../../../../MainConf';
import { useFirebaseDoc } from '../../../../../../hooks/useFirebaseDoc';
import { greenColor } from '../../../../../../utils/colors';
import { PopupContext, PopupProps } from '../../../Popup';

const EmailNPassword = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [popup, setPopup] = useState<PopupProps | null>(null)
  const {setErrorMessage, setSuccessMessage} = useContext(PopupContext)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [getDoc, _, error] = useFirebaseDoc()

  useEffect(() => {
    error && setErrorMessage(error)
  }, [error])

  if (!user) return <></>

  const reauth = async (change: 'password' | 'email') => {
    if (!passwordRef.current) return
    
    try {
      const credential = EmailAuthProvider.credential(
        user.email ?? '', // email could not be null
        passwordRef.current.value
      )
      await reauthenticateWithCredential(user, credential)
      change === 'email' ? applyEmail() : applyPassword()
      setPopup(null)
    } catch (e) {
      e instanceof FirebaseError && setErrorMessage(e.message)
    }
  }
  const openReauthPopup = (change: 'password' | 'email') => {
    console.log(popup);
    const title = change === 'email' ? 'Change email' : 'Change password'
    setPopup({
      title, btnText: 'Cancel',
      content: <>
        <DialogContentText>
          Enter your current password to submit your actions:
        </DialogContentText>
        <TextField
          sx={{mt: 1, width: '100%'}}
          inputRef={passwordRef}
          type='password'
        />
      </>,
      secondBtnProps: {
        children: 'Submit',
        onClick: () => reauth(change),
        sx: {color: greenColor}
      }
    })
    console.log(popup);
  }

  const [email, setEmail] = useState('')

  const applyEmail = async () => {
    try {
      getDoc && getDoc('users', 'uid', user.uid, async (d) => {
        await updateDoc(doc(firestore, 'users', d.id), {email})
      })
      await updateEmail(user, email)
      setSuccessMessage('Your email successfully changed')
      setEmail('')
      setPopup(null)
    } catch (e) {
      e instanceof FirebaseError && setErrorMessage(e.message)
    }
  }
  const cancelEmail = () => {
    setEmail('')
  }

  const [newPassword, setNewPassword] = useState('')

  const applyPassword = async () => {
    try {
      await updatePassword(user, newPassword)
      setSuccessMessage('Your password successfully changed')
      setNewPassword('')
    } catch (e) {
      e instanceof FirebaseError && setErrorMessage(e.message)
    }
  }
  const cancelPassword = async () => {
    setNewPassword('')
  }
  return <>
    {/* user email */}
    <ListInputItem cancel={cancelEmail} apply={() => openReauthPopup('email')} item={{
      title: 'Change email',
      primary: user.email ?? '', // email could not be null
      textField: <TextField
        value={email}
        onChange={e => setEmail(e.target.value)}
        type='email'
      />,
      icon: <ContactMailIcon />
    }} />
    {/* user password */}
    <ListInputItem cancel={cancelPassword} apply={() => openReauthPopup('password')} item={{
      title: 'Change password',
      primary: 'Change password',
      textField: <TextField
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        type='password'
      />,
      icon: <KeyIcon />
    }} />
    {/* popup */}
    {popup && <Popup {...popup} />}
  </>
}

export default EmailNPassword