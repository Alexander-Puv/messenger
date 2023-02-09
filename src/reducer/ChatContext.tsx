import React, { createContext, useContext, useReducer, useState } from 'react'
import { ChatContextProps, IChatContextProvider, LoadingMessage, SendMessageProps } from './ChatReducerTypes'
import { ChatReducer, initial_state } from './ChatReducer'
import { audioDuration } from '../types/messageTypes'
import { FirebaseContext } from '../MainConf'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const ChatContext = createContext<ChatContextProps | null>(null)

export const ChatContextProvider = ({children}: IChatContextProvider) => {
  const {auth, firestore, storage} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [state, dispatch] = useReducer(ChatReducer, initial_state)
  const [loadingMessage, setLoadingMessage] = useState<LoadingMessage | null>(null)
  const [images, setImages] = useState<File[] | null>(null)

  const SendMessage = async (props: SendMessageProps) => {
    if (user) { // it is always true here
      const createdAt = Timestamp.now()

      let val
      let audioDuration
      if ('audioBlob' in props && 'audioDuration' in props) {
        const audioRef = ref(storage, `voiceMessages/${state.chatId}/${createdAt.nanoseconds + user.uid}`)
        await uploadBytes(audioRef, props.audioBlob)
        await getDownloadURL(audioRef).then(url => {
          val = url
        })
        audioDuration = {
          string: props.audioDuration.string,
          number: props.audioDuration.number
        }
      } else if ('img' in props) {

      } else if ('value' in props && 'setValue' in props) {
        val = props.value
        props.setValue('')
      }
      
      // add message
      setLoadingMessage(null)
      await updateDoc(doc(firestore, 'chats', state.chatId), {
        messages: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // if there is audioData, val is url, otherwise val is text
          text: audioDuration ? null : val,
          audioData: audioDuration ? {
            audioUrl: val,
            audioDuration
          } : null,
          createdAt
        })
      })
      
      if (state.user) { // it is always true here
        // change users last message
        await updateDoc(doc(firestore, 'userChats', state.user.uid), {
          [state.chatId + '.lastMessage']: {
            value: audioDuration ? null : val,
            audioData: audioDuration ? {
              audioDuration
            } : null
          },
          [state.chatId + '.date']: serverTimestamp()
        })
        await updateDoc(doc(firestore, 'userChats', user.uid), {
          [state.chatId + '.lastMessage']: {
            value: audioDuration ? null : val,
            audioData: audioDuration ? {
              audioDuration
            } : null
          },
          [state.chatId + '.date']: serverTimestamp()
        })
      }
    }
  }

  return (
    <ChatContext.Provider value={{
      state, dispatch,
      loadingMessage, setLoadingMessage,
      images, setImages,
      SendMessage
    }}>
      {children}
    </ChatContext.Provider>
  )
}