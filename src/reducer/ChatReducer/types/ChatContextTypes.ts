import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { ChatActionType, IChatState } from './ChatReducerTypes'
import { audioDuration } from '../../../types/messageTypes'

export interface ChatContextProps {
  state: IChatState,
  dispatch: React.Dispatch<ChatActionType>,
  loadingMessage: LoadingMessage,
  setLoadingMessage: (prop: LoadingMessage) => void,
  images: File[] | null,
  setImages: (prop: File[] | null) => void,
  SendMessage: ({}: SendMessageProps) => void
}


export type LoadingMessage = {
  text?: string,
  duration?: audioDuration,
  // make for img
  createdAt: Timestamp
} | null


export type SendMessageProps = {
  text?: SendMessageText,
  audio?: SendMessageAudioData,
  images?: SendMessageImage[]
}

export interface SendMessageText {
  value: string,
  setValue: (prop: string) => void,
}

export interface SendMessageAudioData {
  audioBlob: Blob,
  audioDuration: audioDuration,
}

export interface SendMessageImage {
  img: File,
  aspectRatio: number
}


export interface IChatContextProvider {
  children: React.ReactNode
}