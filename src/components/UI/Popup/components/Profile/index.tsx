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
import { EmailNPassword, Photo } from './components';
import useUpdateChats from '../../../../../hooks/useUpdateChats';

const ProfileContent = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const {setErrorMessage, setSuccessMessage} = useContext(PopupContext)
  const [getDoc, _, getDocError] = useFirebaseDoc()
  if (!user) return <></>
  const [updateUserChats, updateChats, __, updateError] = useUpdateChats(user)

  useEffect(() => {
    getDocError && setErrorMessage(getDocError)
    updateError && setErrorMessage(updateError)
  }, [getDocError, updateError])

  const [displayName, setDisplayName] = useState('')

  const applyDisplayName = async () => {
    // Update users collection
    getDoc && getDoc('users', 'uid', user.uid, async (d) => {
      await updateDoc(doc(firestore, 'users', d.id), {
        displayName,
        displayNameLowercase: displayName.toLowerCase()
      })
    })

    await updateProfile(user, {displayName})

    // Update userChats and chats collection
    await updateUserChats('userInfo', 'displayName', displayName)
    await updateChats('displayName', displayName)

    setSuccessMessage('Your username successfully changed')
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
      {/* user email and password */}
      <EmailNPassword />
    </List>
  )
}

export default ProfileContent