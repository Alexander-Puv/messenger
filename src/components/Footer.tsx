import { Box, Button, Grid, TextField } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';

const Footer = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [value, setValue] = useState('')

  const SendMessage = async () => {
    value &&
    addDoc(collection(firestore, 'messages'), {
      uid: user?.uid,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      text: value,
      createdAt: serverTimestamp()
    })
  }
  return (
    <Grid container alignSelf='flex-end' component='footer'>
      <TextField
        variant='outlined'
        sx={{flex: 1}}
        size='small'
        maxRows={10}
        multiline
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Box display='flex' alignItems='flex-end'>
        <Button onClick={() => SendMessage()}>Send</Button>
      </Box>
    </Grid>
  )
}

export default Footer