import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { createContext, useContext, useReducer, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseContext } from '../../MainConf'
import { ChatReducer, initial_state } from './ChatReducer'
import { ChatContextProps, IChatContextProvider, LoadingMessage, SendMessageProps } from './types/ChatContextTypes'

export const ChatContext = createContext<ChatContextProps | null>(null)

export const ChatContextProvider = ({children}: IChatContextProvider) => {
  const {auth, firestore, storage} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [state, dispatch] = useReducer(ChatReducer, initial_state)
  const [loadingMessage, setLoadingMessage] = useState<LoadingMessage | null>(null)
  const [images, setImages] = useState<File[] | null>(null)

  const SendMessage = async ({audio, images, text}: SendMessageProps) => {
    if (user) { // it is always true here
      const createdAt = Timestamp.now()

      let val // text or audio url
      let audioDuration
      const urls: string[] = [] // image URLs

      if (audio) {
        const audioRef = ref(storage, `voiceMessages/${state.chatId}/${createdAt.nanoseconds + user.uid}`)
        await uploadBytes(audioRef, audio.audioBlob)
        await getDownloadURL(audioRef).then(url => {
          val = url
        })
        audioDuration = {
          string: audio.audioDuration.string,
          number: audio.audioDuration.number
        }
      } else if (text) {
        val = text.value
        text.setValue('')

        if(images) {
          const promises = images.map(async img => {
            const imagesRef = ref(storage, `photoMessages/${state.chatId}/${createdAt.nanoseconds + user.uid + img.img.size}`)
            await uploadBytesResumable(imagesRef, img.img)
            await getDownloadURL(imagesRef).then(url => {
              urls.push(url)
            })
          })
          await Promise.all(promises)
        }
      }
      


      setImages(null)
      setLoadingMessage(null)
      await updateDoc(doc(firestore, 'chats', state.chatId), {
        messages: arrayUnion({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // if there is audioDuration, val is url, otherwise val is text
          text: audioDuration ? null : val,
          audioData: audioDuration ? {
            audioUrl: val,
            audioDuration
          } : null,
          imgs: urls.length && images ? urls.map((url, i) => {
            return {
              url,
              imgProps: images[i].imgProps
            }
          }) : null,
          createdAt
        })
      })

      const lastMessage = {
        value: audioDuration ? null : val,
        audioData: audioDuration ? {
          audioDuration
        } : null,
        img: urls.length ? urls[0]: null,
      }
      if (state.user) { // it is always true here
        // change users last message
        await updateDoc(doc(firestore, 'userChats', state.user.uid), {
          [state.chatId + '.lastMessage']: lastMessage,
          [state.chatId + '.date']: serverTimestamp()
        })
        await updateDoc(doc(firestore, 'userChats', user.uid), {
          [state.chatId + '.lastMessage']: lastMessage,
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