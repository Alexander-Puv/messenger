import BadgeIcon from '@mui/icons-material/Badge';
import { List, TextField } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListInputItem } from '../../..';
import { FirebaseContext } from '../../../../../MainConf';
import { useFirebaseDoc } from '../../../../../hooks/useFirebaseDoc';
import { PopupContext } from '../../Popup';
import { EmailNPassword, Phone, Photo } from './components';

const ProfileContent = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const {setErrorMessage, setSuccessMessage} = useContext(PopupContext)
  const [getDoc, _, error] = useFirebaseDoc()

  useEffect(() => {
    error && setErrorMessage(error)
  }, [error])

  if (!user) return <></>

  const [displayName, setDisplayName] = useState('')

  const applyDisplayName = async () => {
    try {
      getDoc && getDoc('users', 'uid', user.uid, async (d) => {
        await updateDoc(doc(firestore, 'users', d.id), {displayName})
      })
      await updateProfile(user, {displayName})
      setSuccessMessage('Your username successfully changed')
    } catch (e) {
      e instanceof FirebaseError && setErrorMessage(e.message)
    }
  }
  const cancelDisplayName = () => {
    setDisplayName('')
  }

  return (
    <List sx={{minWidth: 400}}>
      {/* user photo */}
      <Photo />
      {/* username */}
      <ListInputItem cancel={cancelDisplayName} apply={applyDisplayName} item={{
        title: 'Change username',
        primary: user.displayName ?? '', // displayName could not be null
        textField: <TextField
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
        />,
        icon: <BadgeIcon />
      }} />
      {/* user phone number */}
      <Phone />
      {/* user email and password */}
      <EmailNPassword />
    </List>
  )
}

export default ProfileContent