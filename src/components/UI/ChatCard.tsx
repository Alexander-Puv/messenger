import { Avatar, Card, CardHeader } from '@mui/material'
import { DocumentData } from 'firebase/firestore'
import { useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseContext } from '../../MainConf'
import { ChatContext } from '../../reducer/ChatContext'
import { ChatActionTypes } from '../../reducer/ChatReducerTypes'
import { blue } from '@mui/material/colors'

interface ChatCardProps {
  photoURL: string,
  displayName: string,
  content: string,
  onClick?: (props?: any) => void,
  anotherUser: DocumentData,
  chosen?: boolean
}

const ChatCard = (props: ChatCardProps) => {
  const chatContext = useContext(ChatContext)
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)

  const handleSelect = (anotherUser: DocumentData) => {
    user && chatContext && chatContext.dispatch({type: ChatActionTypes.CHANGE_USER, payload: {currentUser: user, anotherUser}})
  }

  return (
    <Card
      sx={{
        mt: 1, mr: '9px' /* 15px (standard margin) - 6px (scrollbar) */,
        p: 2, display: 'flex',
        backgroundColor: props.chosen ? blue[700] : '',
        '&:first-of-type': {mt: 0},
        cursor: 'pointer',
      }}
      onClick={() => {props.onClick && props.onClick(); handleSelect(props.anotherUser)}}
    >
      <CardHeader sx={{p: 0}}
        avatar={
          <Avatar src={props.photoURL} alt={props.displayName} />
        }
        title={props.displayName}
        subheader={props.content ? props.content : 'No messages'}
      />
    </Card>
  )
}

export default ChatCard