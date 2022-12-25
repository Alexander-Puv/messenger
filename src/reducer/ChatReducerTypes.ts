import React from 'react'
import { DocumentData } from 'firebase/firestore'

export interface ChatContextProps {
  state: IChatState,
  dispatch: React.Dispatch<ChatActionType>
}

export interface IChatContextProvider {
  children: React.ReactNode
}



export interface IChatState {
  chatId: string,
  user: {uid: string} | null
}



export enum ChatActionTypes {
  CHANGE_USER = 'CHANGE_USER'
}

interface ChangeUserAction {
  type: ChatActionTypes.CHANGE_USER,
  payload: {
    currentUser: {uid: string},
    anotherUser: DocumentData,
  }
}

export type ChatActionType = ChangeUserAction