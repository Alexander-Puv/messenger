import Box from '@mui/material/Box';
import { Timestamp, doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../MainConf';
import { ChatContext } from '../reducer/ChatContext';
import { Message } from './UI';

interface audioData {
  audioUrl: string,
  audioDuration: string
}

export interface IMsg {
  uid: string,
  displayName: string,
  photoURL: string,
  text: string | null,
  audioData: audioData | null,
  createdAt: Timestamp
}

const MessagesField = () => {
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