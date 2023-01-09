import Box from '@mui/material/Box';
import { Timestamp, doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../../../MainConf';
import { ChatContext } from '../../../reducer/ChatContext';
import { IMsg } from '../../../types/messageTypes';
import { ChatDate, ChatStart, Message } from './components';
import { useAuthState } from 'react-firebase-hooks/auth';

const MessagesField = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const chatContext = useContext(ChatContext)
  const [messages, setMessages] = useState<IMsg[] | []>([])

  const getMessageDate = (msg: IMsg) => {
    const date = msg.createdAt.toDate()
    const day = date.getDate() < 9 ? `0${date.getDate() + 1}` : date.getDate() + 1
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear() !== new Date().getFullYear() ? ' ' + date.getFullYear() : ''
    return `${day} ${month}${year}`
  }

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
        {messages.map((msg, index) =>
          <React.Fragment key={msg.createdAt.nanoseconds}>
            {
              messages[index - 1] ? // if this is not the first message
                // if this msg created date is not equal to last msg created date
                getMessageDate(messages[index - 1]) !== getMessageDate(msg) &&
                <ChatDate date={getMessageDate(msg)} />
              : // if this is the first message
                <>
                <ChatStart />
                <ChatDate date={getMessageDate(msg)} />
                </>
            } 
            <Message {...msg} />
          </React.Fragment>
        )}
        {chatContext?.loadingMessage && user && // if there is a sent message which isn't still loaded on server
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