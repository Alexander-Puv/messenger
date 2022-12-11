import { Box, Button, Grid, TextField } from '@mui/material';
import { addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Loader } from '../components/UI';
import { FirebaseContext } from '../MainConf';

const Chat = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [value, setValue] = useState('')
  const [messages, loading] = useCollectionData(query(collection(firestore, 'messages'), orderBy("createdAt")))

  const SendMessage = async () => {
    console.log(user);
    
    /* setDoc(doc(firestore, 'messages', 'Chat1'), {
      uid: user?.uid,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      text: value,
      createdAt: serverTimestamp()
    }) */
    
    addDoc(collection(firestore, 'messages'), {
      uid: user?.uid,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      text: value,
      createdAt: serverTimestamp()
    })
  }

  if (loading) {
    return <Loader />
  }
  
  return (
    <Grid container flex={1} p={1}>
      <Box flex={1}>
        
      </Box>
      <Grid container alignSelf='flex-end'>
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
    </Grid>
  )
}

export default Chat