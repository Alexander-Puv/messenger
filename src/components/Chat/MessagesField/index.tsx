import Box from '@mui/material/Box';
import { doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../../../MainConf';
import { ChatContext } from '../../../reducer/ChatContext';
import { IMsg } from '../../../types/messageTypes';
import { Message } from './components';
import { useAuthState } from 'react-firebase-hooks/auth';

const MessagesField = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
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
        {chatContext?.loadingMessage && user &&
          <Message
            audioData={chatContext.loadingMessage.duration ? { // if no duration, then this is text message
              audioDuration: chatContext.loadingMessage.duration,
              audioUrl: ''
            } : null}
            text={chatContext.loadingMessage.text ?? null}
            createdAt={chatContext.loadingMessage.createdAt}
            displayName={user.displayName ?? ''}
            photoURL={user.photoURL ?? ''}
            uid={user.uid}
            isLoading
          />
        }
      </Box>
    </Box>
  </>
}

export default MessagesField