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
import Button from '@mui/material/Button';

const Footer = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [value, setValue] = useState('')
  // const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const chatContext = useContext(ChatContext)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const theme = useTheme()
  console.log(audioRef);

  const SendMessage = async () => {
    if (value && chatContext?.state && chatContext.state.user && user){
      const val = value
      setValue('')
      isRecording && setIsRecording(false)

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

  const StartRecording = async () => {
    setIsRecording(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
    } catch (error) {
      console.error(error);
    }
  }

  const StopRecording = async () => {
    if (mediaRecorder) { // it is always false here but TS doesn't understand it
      setIsRecording(false)
      mediaRecorder.stop();

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = e => {
        audioChunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        if (!audioRef.current) return // it's also always false here
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }
console.log(audioRef.current?.currentSrc);
console.log(audioRef.current?.src);

  return (
    <Grid
      container alignSelf='flex-end'
      component='footer' position='absolute'
      sx={{bottom: 0, right: 0, /* background: theme.palette.background.default */}}
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
        <audio ref={audioRef} />
        <Button onClick={playAudio} sx={{display: 'absolute', width: '50vw', height: '50vh', transform: 'translate(-50vw, -50vh)', background: 'red'}}></Button>
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
              <IconButton onClick={() => SendMessage()} sx={{color: theme.palette.primary.main}}>
                <SendIcon />
              </IconButton>
            </Box>
        }
      </Box>
    </Grid>
  )
}

export default Footer