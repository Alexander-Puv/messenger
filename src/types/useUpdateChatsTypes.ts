import { DocumentData } from "firebase/firestore";


export type useUpdateChatsReturn  = [UpdateUserChats, UpdateChats, IsLoading, UpdateError]

// export type UpdateUserChats = (parentField: 'lastMessage' | 'userInfo', field: string, value: string | boolean) => Promise<void>
export type UpdateUserChats = {
  (parentField: 'userInfo', field: 'displayName' | 'photoURL', value: string, anotherUser?: undefined): Promise<void>;
  (parentField: 'lastMessage', field: 'myMsg' | 'isRead', value: boolean, anotherUser?: DocumentData): Promise<void>;
};

export type UpdateChats = {
  (field: 'photoURL' | 'displayName', value: string, anotherUser?: undefined): Promise<void>
  (field: 'isRead', value: boolean, anotherUser?: DocumentData): Promise<void>
}

export type IsLoading = boolean
export type UpdateError = string | null