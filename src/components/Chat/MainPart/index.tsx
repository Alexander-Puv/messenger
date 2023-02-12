import { Alert, Box, Grid, Paper, Snackbar, Typography, useTheme } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { Footer, MessagesField } from '../..';
import { FirebaseContext } from '../../../MainConf';
import { ChatContext } from '../../../reducer/ChatReducer/ChatContext';
import { IMsg } from '../../../types/messageTypes';
import { backgroundImage } from '../../../utils/colors';
import { DraggedImages } from './components';

const MainPart = () => {
  const {firestore} = useContext(FirebaseContext)
  const chatContext = useContext(ChatContext)
  const [messages, setMessages] = useState<IMsg[] | null>(null)
  const [isDragged, setIsDragged] = useState(false)
  const [error, setError] = useState(false)
  const theme = useTheme()
  
  useEffect(() => {
    if (chatContext?.state) {
      const unsub = onSnapshot(doc(firestore, "chats", chatContext.state.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages)
      });

      return () => {
        unsub()
      }
    }
  }, [chatContext?.state.user?.uid])

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const type = e.dataTransfer.files[0].type
    if (!(type.includes('png') || type.includes('jpg')
    || type.includes('jpeg') || type.includes('webp'))) {
      setError(true)
      setIsDragged(false)
      return // if not an img
    }

    const images = [...e.dataTransfer.files]
    chatContext?.setImages(chatContext.images ? chatContext.images.concat(images) : images)
    setIsDragged(false)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (chatContext?.images) return
    setIsDragged(true)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragged(false)
  }

  return <>
    {messages ?
        <Grid
          container flex={1} position='relative'
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
          sx={{'& *': {
            pointerEvents: isDragged ? 'none' : 'auto'
          }}}
        >
          {!chatContext?.images || !chatContext?.images?.length ? <>
            <MessagesField messages={messages} />
            <Footer />
            <Box
              position='absolute' width='100%' height='100%'
              display={'flex'}
              sx={{
                backgroundColor: theme.palette.background.default,
                backgroundImage: backgroundImage,
                border: '5px dashed white',
                zIndex: !isDragged ? -1 : 1,
                transform: `translateX(${!isDragged ? '100%' : 0})`,
                transition: `${theme.transitions.duration.shortest}ms ease`
              }}
            >
              <Typography sx={{m: 'auto'}} variant="h2">
                Drop files here
              </Typography>
            </Box>
          </>
          : <DraggedImages />}
        </Grid>
    :
      <Box display='flex' flexGrow={1}>
        <Paper sx={{display: 'flex', maxWidth: 650, minHeight: 200, p: 2, m: 'auto'}}>
          <Typography sx={{m: 'auto'}} textAlign='center'>
            Choose a chat in the Sidebar and start a conversation 👈 <br />
            No chats? Find somebody at the top of the Sidebar 👆 <br />
            No friends in this messenger? Find somebody in another one and bring them here 🤫 <br />
            Nobody to bring? Take the initiative: go out and meet new people 👉
          </Typography>
        </Paper>
      </Box>
    }
    <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
      <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
        Nope! Only png, jpg, jpeg and webp!
      </Alert>
    </Snackbar>
  </>
}

export default MainPart