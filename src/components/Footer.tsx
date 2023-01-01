import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import { Box, Grid, IconButton, TextField, Typography } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useContext, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { ChatContext } from '../reducer/ChatContext';
import { redColor } from '../utils/colors';

const Footer = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [value, setValue] = useState('')
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const chatContext = useContext(ChatContext)
  const theme = useTheme()

  const SendMessage = async (audioUrl?: string, audioDuration?: string) => {
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
          text: audioUrl ? null : val,
          audioData: audioUrl ? {
            audioUrl,
            audioDuration
          } : null,
          createdAt: Timestamp.now()
        })
      })
      
      // change users last message
      await updateDoc(doc(firestore, 'userChats', chatContext.state.user.uid), {
        [chatContext.state.chatId + '.lastMessage']: {
          value: audioDuration ? null : val,
          audioData: audioDuration ? {
            audioDuration
          } : null
        },
        [chatContext.state.chatId + '.date']: serverTimestamp()
      })
      await updateDoc(doc(firestore, 'userChats', user.uid), {
        [chatContext.state.chatId + '.lastMessage']: {
          value: audioDuration ? null : val,
          audioData: audioDuration ? {
            audioDuration
          } : null
        },
        [chatContext.state.chatId + '.date']: serverTimestamp()
      })
    }
  }

  const StartRecording = async () => {
    setIsRecording(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true})
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
      recorder.start()
    } catch (error) {
      console.error(error)
    }
  }

  const StopRecording = async (send?: true) => {
    if (mediaRecorder) { // it is always true here but TS doesn't understand it
      setIsRecording(false)
      mediaRecorder.stop()

      if (send) {
        const audioChunks: Blob[] = []
        mediaRecorder.ondataavailable = e => {
          audioChunks.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks)
          const audioUrl = URL.createObjectURL(audioBlob)

          const audio = new Audio(audioUrl)
          audio.onloadedmetadata = () => {
            if (audio.duration == Infinity) {
              audio.currentTime = 1e101;
              audio.ontimeupdate = () => {
                audio.ontimeupdate = () => {
                  SendMessage(audioUrl, audio.duration.toFixed(2).toString().replace('.', ':'));
                }
                audio.currentTime = 0;
              }
            }
            
          }
        }
      }
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
          !isRecording ?
            <IconButton onClick={() => StartRecording()} sx={{color: theme.palette.text.secondary}}>
              <KeyboardVoiceIcon />
            </IconButton>
          : // if user clicked voice message button shows stop button, time of recording and send button
            <Box display='flex'>
              <IconButton onClick={() => StopRecording()} sx={{color: redColor}}>
                <StopIcon />
              </IconButton>
              <Typography></Typography>
              <IconButton onClick={() => StopRecording(true)} sx={{color: theme.palette.primary.main}}>
                <SendIcon />
              </IconButton>
            </Box>
        }
      </Box>
    </Grid>
  )
}

export default Footer