import { Avatar, Box, Grid, Typography } from '@mui/material';
import { blue, blueGrey } from '@mui/material/colors';
import { Timestamp, doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { ChatContext } from '../reducer/ChatContext';

interface msg {
  uid: string,
  displayName: string,
  photoURL: string,
  text: string,
  createdAt: Timestamp
}

const MessagesField = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const chatContext = useContext(ChatContext)
  const [messages, setMessages] = useState([])

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
    <Box sx={{overflowY: 'auto'}} width='100%' position='absolute' top={0} bottom='56px'>
      <Box height='100%'>
        {messages && messages.map((msg: msg) =>
          <Box key={msg.createdAt.nanoseconds} m={1}>
            <Grid container sx={user?.uid === msg.uid ? {flexDirection: 'row-reverse'} : {}}>
              <Avatar src={msg.photoURL} />
              {user?.uid === msg.uid ?
                <Box sx={{transform: 'translateX(-1px)', marginRight: '-1px'}}>
                  <svg viewBox="0 0 8 13" width="8" height="13">
                    <path fill={blue[200]} d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" />
                  </svg>
                </Box>
              :
                <Box sx={{transform: 'translateX(1px)', marginRight: '1px'}}>
                  <svg viewBox="0 0 8 13" height="13" width="8"  version="1.1">
                    <path fill={blueGrey[400]} d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z" />
                  </svg>
                </Box>
              }
              <Box display='flex' flexDirection='column' gap={.5} p='4px 8px' alignItems={user?.uid === msg.uid ? 'flex-end' : 'flex-start'}
                sx={{
                  position: 'relative',
                  border: '1px solid ' + (user?.uid === msg.uid ? blue[200] : blueGrey[400]),
                  borderRadius: '7.5px',
                  borderTopRightRadius: user?.uid === msg.uid ? 0 : 'auto',
                  borderTopLeftRadius: user?.uid === msg.uid ? 'auto' : 0,
                }}
              >
                <Typography variant='caption' component="h4">{msg.displayName}</Typography>
                <Typography>{msg.text}</Typography>
              </Box>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  </>
}

export default MessagesField