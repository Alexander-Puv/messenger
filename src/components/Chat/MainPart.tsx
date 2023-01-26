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
  const [messages, setMessages] = useState<IMsg[] | []>([])

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
  
  return <>
    {messages.length ?
      <Grid container flex={1} position='relative'>
        <MessagesField messages={messages} />
        <Footer />
      </Grid>
    :
      <Box display='flex' flexGrow={1}>
        <Paper sx={{display: 'flex', maxWidth: 650, height: 200, p: 2, m: 'auto'}}>
          <Typography sx={{m: 'auto'}} textAlign='center'>
            Choose a chat in the Sidebar 👈 and start a conversation <br />
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