import { Avatar, CircularProgress, IconButton, ListItem, Tooltip } from '@mui/material'
import React, { useContext, useState, useRef, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseContext } from '../../../../MainConf'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Popup, { PopupContext } from '../Popup'
import { greenColor } from '../../../../utils/colors'
import { updateProfile } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'

const ProfilePhoto = () => {
  const {auth, storage, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null);
  const {setErrorMessage, setSuccessMessage} = useContext(PopupContext)

  if (!user) return <></>

  const uploadPhoto = async () => {
    if (!photo) return
    setIsLoading(true)
    const file = photo
    setPhoto(null)
    const audioRef = ref(storage, `userPhoto/${user.uid}`)
    await uploadBytes(audioRef, file)
    await getDownloadURL(audioRef).then(url => {
      changePhoto(url)
    })
  }

  const changePhoto = async (url: string) => {
    try {
      const q = query(collection(firestore, 'users'), where('uid', '==', user.uid))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (d) => {
        await updateDoc(doc(firestore, 'users', d.data().uid), {
          photoURL: url
        })
      });

      await updateProfile(user, {photoURL: url})
      setSuccessMessage('Your username successfully changed')
    } catch (e) {
      e instanceof FirebaseError && setErrorMessage(e.message)
    }
    setIsLoading(false)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    console.log(droppedFiles)
    setPhoto(droppedFiles[0])
  }

  const onClick = () => {
    inputRef.current?.click()
  }

  return (
    <ListItem
      sx={{transition: '.3s ease'}}
    >
      <input
        type='file'
        onChange={e => e.target.files && setPhoto(e.target.files[0])}
        accept='.jpg, .webp, .jpeg, .png'
        ref={inputRef}
        style={{ display: 'none' }}
      />
      {isLoading ?
        <CircularProgress sx={{m: 'auto'}} />
      :
        <Tooltip
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop} onClick={onClick}
          title='Choose photo' sx={{m: 'auto'}}
        >
          <IconButton>
            <Avatar
              src={user.photoURL ?? ''}
              alt='Choose photo'
              sx={{height: 100, width: 100}}
            />
          </IconButton>
        </Tooltip>
      }
      {photo && <Popup
        title='Are you sure?'
        content="I had a thought maybe you don't want to change photo, huh?"
        btnText="No, not really"
        secondBtnProps={{
          sx: {color: greenColor},
          children: 'Change',
          onClick: uploadPhoto
        }}
      />}
    </ListItem>
  )
}

export default ProfilePhoto