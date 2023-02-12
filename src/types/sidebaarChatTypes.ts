import { Timestamp } from "firebase/firestore"
import { audioDuration } from "./messageTypes"

export interface ISidebarChat {
  date: Timestamp,
  lastMessage: ILastMessage | null,
  userInfo: IUserInfo
}



export interface ILastMessage {
  audioData: ISidebarAudioData | null,
  value: string | null,
  img: string | null
}

export interface ISidebarAudioData {
  audioDuration: audioDuration
}



export interface IUserInfo {
  displayName: string,
  photoURL: string | null,
  uid: string
}