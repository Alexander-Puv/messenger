import React, { createContext, useReducer, useState } from 'react'
import { ChatContextProps, IChatContextProvider, LoadingMessage } from './ChatReducerTypes'
import { ChatReducer, initial_state } from './ChatReducer'

export const ChatContext = createContext<ChatContextProps | null>(null)

export const ChatContextProvider = ({children}: IChatContextProvider) => {
  const [state, dispatch] = useReducer(ChatReducer, initial_state)
  const [loadingMessage, setLoadingMessage] = useState<LoadingMessage | null>(null)
  const [images, setImages] = useState<FileList | null>(null)

  return (
    <ChatContext.Provider value={{
      state, dispatch,
      loadingMessage, setLoadingMessage,
      images, setImages
    }}>
      {children}
    </ChatContext.Provider>
  )
}