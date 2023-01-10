import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import { Avatar, Box, Card, CardHeader, Typography, Paper } from '@mui/material'
import { blue } from '@mui/material/colors'
import { DocumentData, Timestamp } from 'firebase/firestore'
import { useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseContext } from '../../../../MainConf'
import { ChatContext } from '../../../../reducer/ChatContext'
import { ChatActionTypes } from '../../../../reducer/ChatReducerTypes'
import { ILastMessage, IUserInfo } from '../../../../types/sidebaarChatTypes'
import { getSidebarDate } from '../../../../utils/getDate'

interface ChatCardProps {
  date?: Timestamp,
  lastMessage: ILastMessage | null,
  anotherUser: IUserInfo | DocumentData,
  onClick?: (props?: any) => void,
  chosen?: boolean
}

const ChatCard = (props: ChatCardProps) => {
  const chatContext = useContext(ChatContext)
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)

  /* const getDate = (date: Date) => {
    const day = date.getDate() + 1
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    
    if (year !== new Date().getFullYear()) {
      return `${day}.${month}.${year}`
    }
    if (month !== new Date().getMonth() + 1 || day !== new Date().getDate() + 1) {
      return `${day} ${month}`
    }
    return ''
  } */

  const handleSelect = (anotherUser: DocumentData) => {
    user && chatContext && chatContext.dispatch({
      type: ChatActionTypes.CHANGE_USER,
      payload: {currentUser: user, anotherUser}
    })
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
      <CardHeader sx={{
        p: 0, width: '100%', position: 'relative',
        overflow: 'hidden', textOverflow: '', whiteSpace: 'nowrap'
      }}
        avatar={
          <Avatar src={props.anotherUser.photoURL} alt={props.anotherUser.displayName} />
        }
        title={props.anotherUser.displayName}
        subheader={
          <Box>
            {props.lastMessage ? // if there is last message
              props.lastMessage.value ?? // check is there text
              <Box display='flex' alignItems='flex-end'>
                <KeyboardVoiceIcon fontSize='small' />
                <Typography fontSize='inherit' lineHeight='1'>
                  {props.lastMessage.audioData?.audioDuration}
                </Typography>
              </Box> // otherwise audio
            : 'No comments' // if no messages - no comments
            }
            {props.date &&
              <Paper sx={{
                position: 'absolute', top: 0, right: 0,
                backgroundColor: props.chosen ? blue[700] : '', boxShadow: 'none'
              }}>
                {getSidebarDate(props.date.toDate())}
              </Paper>
            }
          </Box>
        }
      />
    </Card>
  )
}

export default ChatCard