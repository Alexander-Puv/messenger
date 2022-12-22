import React, { createContext, useReducer } from 'react'
import { ChatContextProps, IChatContextProvider } from './ChatReducerTypes'
import { ChatReducer, initial_state } from './ChatReducer'

export const ChatContext = createContext<ChatContextProps | null>(null)

export const ChatContextProvider = ({children}: IChatContextProvider) => {
  const [state, dispatch] = useReducer(ChatReducer, initial_state)

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}