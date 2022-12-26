import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useContext, useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { ChatContext } from '../reducer/ChatContext';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import useTheme from '@mui/material/styles/useTheme';

const Footer = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [value, setValue] = useState('')
  const chatContext = useContext(ChatContext)
  const ref = useRef<HTMLDivElement | null>(null)
  const theme = useTheme()

  const SendMessage = async () => {
    if (value && chatContext?.state && chatContext.state.user && user){
      const val = value
      setValue('')

      await updateDoc(doc(firestore, 'chats', chatContext.state.chatId), {
        messages: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          text: val,
          createdAt: Timestamp.now()
        })
      })
      
      await updateDoc(doc(firestore, 'userChats', chatContext.state.user.uid), {
        [chatContext.state.chatId + '.lastMessage']: {
          value: val
        },
        [chatContext.state.chatId + '.date']: serverTimestamp()
      })
      await updateDoc(doc(firestore, 'userChats', user.uid), {
        [chatContext.state.chatId + '.lastMessage']: {
          value: val
        },
        [chatContext.state.chatId + '.date']: serverTimestamp()
      })
    }
  }

  const VoiceMessage = async() => {

  }

  return (
    <Grid
      container alignSelf='flex-end'
      component='footer' position='absolute'
      sx={{bottom: 0, right: 0, /* background: theme.palette.background.default */}}
      p={1} gap={1}
    >
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
        ref={ref}
      />
      <Box display='flex' alignItems='flex-end'>
        {value ? 
          <IconButton onClick={() => SendMessage()} sx={{color: theme.palette.primary.main}}>
            <SendIcon />
          </IconButton>
        :
          <IconButton onClick={() => VoiceMessage()} sx={{color: theme.palette.text.secondary}}>
            <KeyboardVoiceIcon />
          </IconButton>
        }
      </Box>
    </Grid>
  )
}

export default Footer