import React from 'react'
import { DocumentData, Timestamp } from 'firebase/firestore'

export interface ChatContextProps {
  state: IChatState,
  dispatch: React.Dispatch<ChatActionType>,
  loadingMessage: LoadingMessage,
  setLoadingMessage: (prop: LoadingMessage) => void
}

interface ILoadingMessage {
  duration?: string,
  text?: string,
  createdAt: Timestamp
}
export type LoadingMessage = ILoadingMessage | null

export interface IChatContextProvider {
  children: React.ReactNode
}



export interface IChatState {
  chatId: string,
  user: DocumentData | null
}



export enum ChatActionTypes {
  CHANGE_USER = 'CHANGE_USER'
}

interface ChangeUserAction {
  type: ChatActionTypes.CHANGE_USER,
  payload: {
    currentUser: DocumentData,
    anotherUser: DocumentData,
  }
}

export type ChatActionType = ChangeUserAction