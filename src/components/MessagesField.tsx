import { Avatar, Box, Grid, Typography } from '@mui/material';
import { blue, blueGrey } from '@mui/material/colors';
import { Timestamp, doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { ChatContext } from '../reducer/ChatContext';
import { Loader, Message } from './UI';

export interface Msg {
  uid: string,
  displayName: string,
  photoURL: string,
  text: string,
  createdAt: Timestamp
}

const MessagesField = () => {
  const {firestore} = useContext(FirebaseContext)
  const chatContext = useContext(ChatContext)
  const [messages, setMessages] = useState<Msg[] | []>([])

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
      <Box height='100%' display='flex' flexDirection='column'>
        {messages.map((msg) =>
          <Message {...msg} key={msg.createdAt.nanoseconds} />
        )}
      </Box>
    </Box>
  </>
}

export default MessagesField