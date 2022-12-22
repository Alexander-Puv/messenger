import { ChatActionType, ChatActionTypes, IChatState } from "./ChatReducerTypes";

export const initial_state: IChatState = {
  chatId: 'null',
  user: null
}

export const ChatReducer = (state: IChatState, action: ChatActionType): IChatState => {
  switch (action.type) {
    case ChatActionTypes.CHANGE_USER:
      return {
        user: action.payload.anotherUser,
        chatId: action.payload.currentUser.uid > action.payload.anotherUser.uid
        ? action.payload.currentUser.uid + action.payload.anotherUser.uid
        : action.payload.anotherUser.uid + action.payload.currentUser.uid
      };
    default:
      return state;
  }
}