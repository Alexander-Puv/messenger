import { DocumentData } from 'firebase/firestore'

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