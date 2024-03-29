import { DocumentData, FieldPath, QueryDocumentSnapshot } from "firebase/firestore"

export type useFirebaseDocReturn  = [GetDoc, IsLoading, GetDocError]

export type GetDoc = ((
  collectionName: string,
  field: string | FieldPath,
  value: unknown,
  func: (d: QueryDocumentSnapshot<DocumentData>) => void
) => void) | null
export type IsLoading = boolean
export type GetDocError = string | null