import { Box, Button, Grid, TextField } from '@mui/material';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { ChatContext } from '../reducer/ChatContext';

const Footer = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [value, setValue] = useState('')
  const chatContext = useContext(ChatContext)

  const SendMessage = async () => {
    if (!chatContext?.state) {
      return
    }

    if (value && chatContext?.state && chatContext.state.user && user){
      await updateDoc(doc(firestore, 'chats', chatContext.state.chatId), {
        messages: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          text: value,
          createdAt: Timestamp.now()
        })
      })
      
      await updateDoc(doc(firestore, 'userChats', chatContext.state.user.uid), {
        [chatContext.state.chatId + '.lastMessage']: {
          value
        },
        [chatContext.state.chatId + '.date']: serverTimestamp()
      })
      await updateDoc(doc(firestore, 'userChats', user.uid), {
        [chatContext.state.chatId + '.lastMessage']: {
          value
        },
        [chatContext.state.chatId + '.date']: serverTimestamp()
      })

      setValue('')
    }
  }

  return (
    <Grid container alignSelf='flex-end' component='footer' position='absolute' sx={{bottom: 0, right: 0}} p={1}>
      <TextField
        variant='outlined'
        sx={{flex: 1}}
        size='small'
        maxRows={10}
        multiline
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {if (e.code === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          SendMessage();
        }}}
      />
      <Box display='flex' alignItems='flex-end'>
        <Button onClick={() => SendMessage()}>Send</Button>
      </Box>
    </Grid>
  )
}

export default Footer