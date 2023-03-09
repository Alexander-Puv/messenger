import { FirebaseError } from 'firebase/app'
import { User } from 'firebase/auth'
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../MainConf'
import { IMsg } from '../types/messageTypes'
import { ISidebarChat } from '../types/sidebaarChatTypes'
import { UpdateChats, UpdateError, UpdateUserChats, useUpdateChatsReturn } from '../types/useUpdateChatsTypes'

const useUpdateChats = (user: User): useUpdateChatsReturn => {
  const {firestore} = useContext(FirebaseContext)
  const [error, setError] = useState<UpdateError>(null)
  const [isLoading, setIsLoading] = useState(false)

  const UpdateUserChats: UpdateUserChats = async (parentField, field, value, anotherUserUid) => {
    try {
      setIsLoading(true)
      
      // Update userChats collection
      const userChatsQuery = query(collection(firestore, 'userChats'))
      const userChatsSnapshot = await getDocs(userChatsQuery)
    
      userChatsSnapshot.forEach(async (d) => {
        // const chatId = anotherUserUid ?
        //   anotherUserUid > d.id ? anotherUserUid + d.id : d.id + anotherUserUid
        // : user.uid > d.id ? user.uid + d.id : d.id + user.uid
        // const chatData = d.data()[chatId]
        const chatIds = Object.keys(d.data())
        
        for (let i = 0; i < chatIds.length; i++) {
          const chatId = chatIds[i]
          const chatData = d.data()[chatId]
          if (anotherUserUid) {
            if (chatId.includes(anotherUserUid) && chatId.includes(user.uid) &&
              ((chatData.userInfo.uid === user.uid && chatData.lastMessage.myMsg) ||
              (chatData.userInfo.uid === anotherUserUid && !chatData.lastMessage.myMsg))) {
              await updateDoc(doc(firestore, 'userChats', d.id), {
                [`${chatId}.${parentField}.${field}`]: value
              })
            }
          } else if (chatData.userInfo.uid === user.uid) {
            await updateDoc(doc(firestore, 'userChats', d.id), {
              [`${chatId}.${parentField}.${field}`]: value
            })
          }
        }
      })
    } catch (e) {
      e instanceof FirebaseError && setError(e.message)
    }
    setIsLoading(false)
  }

  const UpdateChats: UpdateChats = async (field, value, anotherUserUid) => {
    try {
      setIsLoading(true)
    
      // Update chats collection
      const chatsQuery = query(collection(firestore, 'chats'))
      const chatsSnapshot = await getDocs(chatsQuery)
    
      chatsSnapshot.forEach(async (d) => {
        if (!d.id.includes(user.uid)) return
        
        if (d.data().messages) {
          const updatedMessages = d.data().messages.map((message: IMsg) => {
            if (message.uid === anotherUserUid) {
              // another user's messages now are read by current user
              // if there is anotherUser, it is 'isRead' field
              return {
                ...message,
                [field]: value
              }
            } else if (!anotherUserUid && message.uid === user.uid) {
              // change photoURL or displayName for every current user's message
              return {
                ...message,
                [field]: value
              }
            } else {
              return message
            }
          })
          
          await updateDoc(doc(firestore, 'chats', d.id), {
            messages: updatedMessages
          })
        }
      })
    } catch (e) {
      e instanceof FirebaseError && setError(e.message)
    }
    setIsLoading(false)
  }

  return [
    UpdateUserChats,
    UpdateChats,
    isLoading,
    error
  ]
}

export default useUpdateChats