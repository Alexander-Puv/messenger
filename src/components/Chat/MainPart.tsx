import { Box, Grid, Paper, Typography } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { Footer, MessagesField } from '..';
import { FirebaseContext } from '../../MainConf';
import { ChatContext } from '../../reducer/ChatContext';
import { IMsg } from '../../types/messageTypes';

const MainPart = () => {
  const {firestore} = useContext(FirebaseContext)
  const chatContext = useContext(ChatContext)
  const [messages, setMessages] = useState<IMsg[] | null>(null)
  const [isDragged, setIsDragged] = useState(false)
  
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
    chatContext?.setImages(e.dataTransfer.files)
    setIsDragged(false)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragged(true)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragged(false)
  }

  return <>
    {messages ?
      <Grid container flex={1} position='relative' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        <MessagesField messages={messages} />
        <Footer />
        {isDragged && 
          <Box
            position='absolute' width='100%' height='100%'
            sx={{backgroundColor: 'rgb(0 0 0 / 50%)'}}
          >
            Drop files here
          </Box>
        }
        {chatContext?.images &&
          <Box
            position='absolute' width='100%' height='100%'
            sx={{backgroundColor: 'rgb(0 0 0 / 50%)'}}
          >
            {chatContext.images.item(0)?.name}
          </Box>
        }
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
  </>
}

export default MainPart