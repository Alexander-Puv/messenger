import { Timestamp } from "firebase/firestore"

export interface ISidebarChat {
  date: Timestamp,
  lastMessage: ILastMessage | null,
  userInfo: IUserInfo
}



export interface ILastMessage {
  audioData: ISidebarAudioData | null,
  value: string | null,
}

export interface ISidebarAudioData {
  audioDuration: string
}



export interface IUserInfo {
  displayName: string,
  photoURL: string | null,
  uid: string
}