import { Timestamp } from "firebase/firestore"

export interface IMsg {
  uid: string,
  displayName: string,
  photoURL: string | null,
  text: string | null,
  audioData: audioData | null,
  imgs: imgData[] | null,
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

export interface imgData {
  url: string,
  imgProps: {
    width: number,
    height: number
  }
}