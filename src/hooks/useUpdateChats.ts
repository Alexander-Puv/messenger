import { FirebaseError } from 'firebase/app'
import { User } from 'firebase/auth'
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { FirebaseContext } from '../MainConf'
import { IMsg } from '../types/messageTypes'
import { ISidebarChat } from '../types/sidebaarChatTypes'
import { UpdateChats, UpdateError, useUpdateChatsReturn } from '../types/useUpdateChatsTypes'

const useUpdateChats = (user: User): useUpdateChatsReturn => {
  const {firestore} = useContext(FirebaseContext)
  const [error, setError] = useState<UpdateError>(null)
  const [isLoading, setIsLoading] = useState(false)

  const UpdateChats: UpdateChats = async (field, value) => {
    try {
      setIsLoading(true)
      
      // Update userChats collection
      const userChatsQuery = query(collection(firestore, 'userChats'))
      const userChatsSnapshot = await getDocs(userChatsQuery)
    
      userChatsSnapshot.forEach(async (d) => {
        const chatId = user.uid > d.id ? user.uid + d.id : d.id + user.uid
        const chatData = Object.values(d.data())
    
        chatData.map(async (thisChatData: ISidebarChat) => {
          if (thisChatData.userInfo.uid === user.uid) {
            await updateDoc(doc(firestore, 'userChats', d.id), {
              [`${chatId}.userInfo.${field}`]: value
            })
          }
        })
      })
    
      // Update chats collection
      if (!userChatsSnapshot.empty) {
        const chatsQuery = query(collection(firestore, 'chats'))
        const chatsSnapshot = await getDocs(chatsQuery)
        console.log(chatsSnapshot)
    
        chatsSnapshot.forEach(async (d) => {
          const chatId = d.id
          const chatData = d.data()
          if (!chatId.includes(user.uid)) return
          
          if (chatData.messages) {
            const updatedMessages = chatData.messages.map((message: IMsg) => {
              if (message.uid === user.uid) {
                return {
                  ...message,
                  [field]: value
                }
              } else {
                return message
              }
            })
    
            await updateDoc(doc(firestore, 'chats', chatId), {
              messages: updatedMessages
            })
          }
        })
      }
    } catch (e) {
      e instanceof FirebaseError && setError(e.message)
    }
    setIsLoading(false)
  }

  return [
    UpdateChats,
    isLoading,
    error
  ]
}

export default useUpdateChats