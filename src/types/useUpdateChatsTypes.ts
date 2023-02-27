

export type useUpdateChatsReturn  = [UpdateChats, IsLoading, UpdateError]

export type UpdateChats = (field: 'displayName' | 'photoURL', value: string) => Promise<void>
export type IsLoading = boolean
export type UpdateError = string | null