import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseContext } from '../../../../MainConf'
import { ChatContext } from '../../../../reducer/ChatReducer/ChatContext'
import { ChatCard } from './'
import { ISidebarChat } from '../../../../types/sidebaarChatTypes'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const UserChats = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [chats, setChats] = useState<DocumentData | null | undefined>(null)
  const [isLoading, setIsLoading] = useState(true)
  const chatContext = useContext(ChatContext)

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(firestore, "userChats", user.uid), (doc) => {
        setChats(doc.data())
        setIsLoading(false)
      });

      return () => {
        unsub()
      }
    }
  }, [user?.uid])

  return <>
    {isLoading ?
      <Box display='flex' alignItems='center'>
        <CircularProgress sx={{m: 'auto'}} />
      </Box>
    : chats && Object.entries(chats).sort((a, b) => b[1].date - a[1].date).map((chat: [string, ISidebarChat]) =>
      <ChatCard
        date={chat[1].date}
        lastMessage={chat[1].lastMessage ?? null}
        anotherUser={chat[1].userInfo}
        chosen={chatContext?.state.user?.uid === chat[1].userInfo.uid ? true : false}
        key={chat[0]}
      /> 
    )}
  </>
}

export default UserChats