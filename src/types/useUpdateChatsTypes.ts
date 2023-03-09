export type useUpdateChatsReturn  = [UpdateUserChats, UpdateChats, IsLoading, UpdateError]

export type UpdateUserChats = {
  (parentField: 'userInfo', field: 'displayName' | 'photoURL', value: string, anotherUserUid?: undefined): Promise<void>;
  (parentField: 'lastMessage', field: 'isRead', value: boolean, anotherUserUid: string): Promise<void>;
};

export type UpdateChats = {
  (field: 'photoURL' | 'displayName', value: string, anotherUserUid?: undefined): Promise<void>
  (field: 'isRead', value: boolean, anotherUserUid: string): Promise<void>
}

export type IsLoading = boolean
export type UpdateError = string | null