

export type useUpdateChatsReturn  = [UpdateUserChats, UpdateChats, IsLoading, UpdateError]

// export type UpdateUserChats = (parentField: 'lastMessage' | 'userInfo', field: string, value: string | boolean) => Promise<void>
export type UpdateUserChats = {
  (parentField: 'lastMessage', field: 'myMsg' | 'isRead', value: boolean): Promise<void>;
  (parentField: 'userInfo', field: 'displayName' | 'photoURL', value: string): Promise<void>;
};

export type UpdateChats = {
  (field: 'photoURL' | 'displayName', value: string): Promise<void>
  (field: 'isRead', value: boolean): Promise<void>
}

export type IsLoading = boolean
export type UpdateError = string | null