import { Timestamp } from "firebase/firestore"

export interface audioData {
  audioUrl: string,
  audioDuration: string
}

export interface IMsg {
  uid: string,
  displayName: string,
  photoURL: string,
  text: string | null,
  audioData: audioData | null,
  createdAt: Timestamp
}