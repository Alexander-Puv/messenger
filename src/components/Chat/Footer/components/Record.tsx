import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import { Box, IconButton, Typography } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { useContext, useState } from 'react';
import { redColor } from '../../../../utils/colors';
import { getDownloadURL, ref } from 'firebase/storage'
// import { child, push, ref } from 'firebase/database';
import { FirebaseContext } from '../../../../MainConf';
import { audioData } from '../../../../types/messageTypes';
import { useAuthState } from 'react-firebase-hooks/auth';

interface RecordProps {
  isRecording: boolean,
  setIsRecording: (isRecording: boolean) => void,
  SendMessage: (audioData: audioData) => void
}

const Record = ({isRecording, setIsRecording, SendMessage}: RecordProps) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const {storage, auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const theme = useTheme()

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
            if (audio.duration === Infinity) {
              audio.currentTime = 1e101;
              audio.ontimeupdate = () => {
                audio.ontimeupdate = async () => {
                  const allSeconds = Math.floor(audio.duration)
                  const minutes = Math.floor(allSeconds / 60)
                  const seconds = allSeconds - minutes * 60
          
                  const audioRef = ref(storage, 'chats')
                  await getDownloadURL(audioRef).then(url => {
                    console.log(url);
                    
                  })
                    
                  // SendMessage({audioUrl: audioRef.toString(), audioDuration: `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`})
                  /* console.log(audioRef);
                  console.log(audioRef.toString());
                  await push(child(audioRef, 'messages'), {
                    messages: arrayUnion({
                      uid: user.uid,
                      displayName: user.displayName,
                      photoURL: user.photoURL,
                      audioData: {
                        audioUrl: audioRef.toString(),
                        audioDuration: `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
                      },
                      createdAt: Timestamp.now()
                    })
                  }) */
                  /* getDownloadURL(audioRef).then(url => {
                    console.log(audioRef);
                    console.log(url);
                    SendMessage({audioUrl: url, audioDuration: `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`})
                  }).catch(e => {
                    console.log(e);
                  }) */
                }
                audio.currentTime = 0;
              }
            }
          }
        }
      }
    }
  }

  return <>
    {!isRecording ?
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
  </>
}

export default Record