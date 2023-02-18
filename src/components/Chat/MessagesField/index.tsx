import Box from '@mui/material/Box';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../MainConf';
import { ChatContext } from '../../../reducer/ChatReducer/ChatContext';
import { IMsg } from '../../../types/messageTypes';
import { getMessageDate } from '../../../utils/getDate';
import { ChatDate, ChatStart, Message } from './components';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const MessagesField = ({messages}: {messages: IMsg[]}) => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const chatContext = useContext(ChatContext)
  const [newMessages, setNewMessages] = useState([...messages])

  useEffect(() => {
    setNewMessages([...messages])
  }, [messages])

  // useEffect(() => {
  //   const reverseChat = async () => {
  //     if (!chatContext) return
  //     const docRef = doc(firestore, "chats", chatContext.state.chatId);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       console.log(true);
        
  //       // Reverse the order of the messages array
  //       const messages = docSnap.data().messages;
  //       messages.reverse();
    
  //       // Update the document with the reversed array of messages
  //       updateDoc(docRef, { messages: messages });
        
  //       console.log(true);
  //     } else {
  //       console.log(docSnap);
  //     }
  //   }
  //   chatContext?.state.chatId && reverseChat()
  // }, [chatContext?.state.chatId])

  return <>
    <Box sx={{overflowY: 'auto', userSelect: 'initial'}} width='100%' position='absolute' top={0} bottom='56px'>
      <Box height='100%' display='flex' flexDirection='column'>
        <ChatStart />
        {newMessages.map((msg, index) =>
          <React.Fragment key={msg.createdAt.nanoseconds}>
            {
              newMessages[index - 1] ? // if this is not the first message
                // if this msg created date is not equal to last msg created date
                getMessageDate(newMessages[index - 1].createdAt.toDate()) !== getMessageDate(msg.createdAt.toDate())
                  && <ChatDate date={getMessageDate(msg.createdAt.toDate())} />
              : // if this is the first message
                <ChatDate date={getMessageDate(msg.createdAt.toDate())} />
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
            imgs={null} // images are loading in DraggedImages (for now)
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