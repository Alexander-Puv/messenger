import { Avatar, IconButton, ListItem, Tooltip } from '@mui/material'
import React, { useContext, useState, useRef, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseContext } from '../../../../MainConf'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Popup from '../Popup'

const ProfilePhoto = () => {
  const {auth, storage} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [photo, setPhoto] = useState<File | null>(null);
  const [URL, setURL] = useState('');
  const [popup, setPopup] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!user) return <></>

  useEffect(() => {
    const uploadPhoto = async (file: File) => {
      const audioRef = ref(storage, `userPhoto/${user.uid}`)
      // this url is to
      await uploadBytes(audioRef, file)
      await getDownloadURL(audioRef).then(url => {
        setURL(url)
      })
    }
    
    photo && uploadPhoto(photo)
  }, [photo])

  const changePhoto = () => {
    /* updateProfile(user, {photoURL: }).
      then(() => {
        setSuccessMessage('Your username successfully changed')
      }).catch((e) => {
        e instanceof FirebaseError && setErrorMessage(e.message)
      }) */
  }

  const onDrop = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    console.log(droppedFiles);
    setPhoto(droppedFiles[0]);
  }

  const onClick = () => {
    inputRef.current?.click()
  }

  return (
    <ListItem
      onDragOver={e => e.preventDefault()} onDrop={onDrop}
      sx={{transition: '.3s ease'}}
    >
      <input
        type='file'
        onChange={e => e.target.files && setPhoto(e.target.files[0])}
        accept='.jpg, .webp, .jpeg, .png'
        ref={inputRef}
        style={{ display: 'none' }}
      />
      <Tooltip title='Choose photo' sx={{m: 'auto'}} onClick={onClick}>
        <IconButton>
          <Avatar
            src={user.photoURL ?? ''}
            alt='Choose photo'
            sx={{height: 100, width: 100}}
          />
        </IconButton>
      </Tooltip>
      {popup && <Popup
        title='Are you sure?'
        content="I had a thought maybe you don't want to change photo, huh?"
        btnText="No, not really"
        
      />}
    </ListItem>
  )
}

export default ProfilePhoto