import React from 'react'
import { DocumentData, Timestamp } from 'firebase/firestore'
import { audioDuration } from '../types/messageTypes'

export interface ChatContextProps {
  state: IChatState,
  dispatch: React.Dispatch<ChatActionType>,
  loadingMessage: LoadingMessage,
  setLoadingMessage: (prop: LoadingMessage) => void,
  images: File[] | null,
  setImages: (prop: File[] | null) => void,
}

interface ILoadingMessage {
  duration?: audioDuration,
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