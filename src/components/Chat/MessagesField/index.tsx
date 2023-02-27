import Box from '@mui/material/Box';
import React, { useContext, useLayoutEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../MainConf';
import { ChatContext } from '../../../reducer/ChatReducer/ChatContext';
import { IMsg } from '../../../types/messageTypes';
import { getMessageDate } from '../../../functions/getDate';
import { ChatDate, ChatStart, Message } from './components';

const MessagesField = ({messages}: {messages: IMsg[]}) => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const chatContext = useContext(ChatContext)

  return <>
    <Box sx={{overflowY: 'auto', userSelect: 'initial'}} width='100%' position='absolute' top={0} bottom='56px'>
      <Box height='100%' display='flex' flexDirection='column'>
        <ChatStart />
        {messages.map((msg, index) =>
          <React.Fragment key={msg.createdAt.nanoseconds}>
            {
              messages[index - 1] ? // if this is not the first message
                // if this msg created date is not equal to last msg created date
                getMessageDate(messages[index - 1].createdAt.toDate()) !== getMessageDate(msg.createdAt.toDate())
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