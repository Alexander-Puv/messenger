import SendIcon from '@mui/icons-material/Send';
import { Box, Grid, IconButton, TextField } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../MainConf';
import { ChatContext } from '../../../reducer/ChatContext';
import { Record } from './components';
import { audioData } from '../../../types/messageTypes';

const Footer = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [value, setValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const chatContext = useContext(ChatContext)
  const theme = useTheme()

  const SendMessage = async (audioData?: audioData) => {
    if (chatContext?.state && chatContext.state.user && user){
      const val = value
      setValue('')
      isRecording && setIsRecording(false)

      // add message
      await updateDoc(doc(firestore, 'chats', chatContext.state.chatId), {
        messages: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          text: audioData ? null : val,
          audioData: audioData ? {
            audioUrl: audioData.audioUrl,
            audioDuration: audioData.audioDuration
          } : null,
          createdAt: Timestamp.now()
        })
      })
      
      // change users last message
      await updateDoc(doc(firestore, 'userChats', chatContext.state.user.uid), {
        [chatContext.state.chatId + '.lastMessage']: {
          value: audioData ? null : val,
          audioData: audioData ? {
            audioDuration: audioData.audioDuration
          } : null
        },
        [chatContext.state.chatId + '.date']: serverTimestamp()
      })
      await updateDoc(doc(firestore, 'userChats', user.uid), {
        [chatContext.state.chatId + '.lastMessage']: {
          value: audioData ? null : val,
          audioData: audioData ? {
            audioDuration: audioData.audioDuration
          } : null
        },
        [chatContext.state.chatId + '.date']: serverTimestamp()
      })
    }
  }

  return (
    <Grid
      container alignSelf='flex-end'
      component='footer' position='absolute'
      sx={{
        bottom: 0, right: 0,
        background: theme.palette.background.default,
        backgroundImage: 'linear-gradient(rgba(255 255 255 / 0.02), rgba(255 255 255 / 0.02))'
      }}
      p={1}
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
      />
      <Box display='flex' alignItems='flex-end'>
        {value ? // if the user wrote somthing, shows send button
          <IconButton onClick={() => SendMessage()} sx={{color: theme.palette.primary.main}}>
            <SendIcon />
          </IconButton>
        : // otherwise shows the voice message button
          <Record isRecording={isRecording} setIsRecording={setIsRecording} SendMessage={SendMessage} />
        }
      </Box>
    </Grid>
  )
}

export default Footer