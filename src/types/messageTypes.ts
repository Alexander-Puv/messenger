import { Timestamp } from "firebase/firestore"

export interface IMsg {
  uid: string,
  displayName: string,
  photoURL: string,
  text: string | null,
  audioData: audioData | null,
  createdAt: Timestamp,
  isLoading?: boolean
}

export interface audioData {
  audioUrl: string,
  audioDuration: audioDuration
}

export interface audioDuration {
  string: string,
  number: number
}