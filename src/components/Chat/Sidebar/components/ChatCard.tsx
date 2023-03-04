import UnreadIcon from '@mui/icons-material/Done'
import ReadIcon from '@mui/icons-material/DoneAll'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import { Avatar, Box, Card, CardHeader, Paper, Typography, useTheme, Chip } from '@mui/material'
import { blue } from '@mui/material/colors'
import { DocumentData, Timestamp } from 'firebase/firestore'
import { useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseContext } from '../../../../MainConf'
import { getSidebarDate } from '../../../../functions/getDate'
import { ChatContext } from '../../../../reducer/ChatReducer/ChatContext'
import { ChatActionTypes } from '../../../../reducer/ChatReducer/types/ChatReducerTypes'
import { ILastMessage, IUserInfo } from '../../../../types/sidebaarChatTypes'

interface ChatCardProps {
  date?: Timestamp,
  lastMessage: ILastMessage | null,
  anotherUser: IUserInfo | DocumentData,
  onClick?: (props?: any) => void,
  chosen?: boolean
}

const ChatCard = ({date, lastMessage, anotherUser, onClick, chosen}: ChatCardProps) => {
  const chatContext = useContext(ChatContext)
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const theme = useTheme()

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
        backgroundColor: chosen ? blue[700] : '',
        '&:first-of-type': {mt: 0},
        cursor: 'pointer',
      }}
      onClick={() => {onClick && onClick(); handleSelect(anotherUser)}}
    >
      <CardHeader sx={{
        p: 0, width: '100%', position: 'relative',
        overflow: 'hidden', textOverflow: '', whiteSpace: 'nowrap'
      }}
        avatar={
          <Avatar src={anotherUser.photoURL} alt={anotherUser.displayName} />
        }
        title={anotherUser.displayName}
        subheader={
          <Box>
            {lastMessage ? <> {// if there is last message
              lastMessage.audioData ? // check is there audio
                <Box display='flex' alignItems='flex-end' gap={0.5}>
                  <KeyboardVoiceIcon fontSize='small' />
                  <Typography fontSize='inherit' lineHeight='1'>
                    {lastMessage.audioData.audioDuration.string}
                  </Typography>
                </Box>
              : lastMessage.img ? // check is there images
                <Box
                  display='flex' alignItems='center'
                  height={20} gap={0.5}
                  sx={{'img': {maxHeight: 20, maxWidth: 40}}}
                >
                  <img src={lastMessage.img} />
                  <Typography fontSize='inherit' lineHeight='1'>
                    {lastMessage.value}
                  </Typography>
                </Box>
              : lastMessage.value // otherwise just text
              }
              {/* is message read */}
              <Box 
                position='absolute' top={0} bottom={0} right={0}
                display='flex' flexDirection='column'
                justifyContent='space-between'
                alignItems='flex-end'
                sx={{'div': {
                  p: '0 5px',
                  color: theme.palette.text.secondary, boxShadow: 'none',
                  backgroundColor: chosen ? blue[700] : ''
                }}}
              >
                {date &&
                  <Paper sx={{
                    display: 'flex'
                  }}>
                    {getSidebarDate(date.toDate())}
                  </Paper>
                }
                <Paper sx={{
                  display: 'flex'
                }}>
                  {lastMessage.myMsg ? // if my message
                    lastMessage.isRead ?
                      <ReadIcon sx={{color: chosen ? '' : theme.palette.primary.main}} />
                    : <UnreadIcon />
                  : !lastMessage.isRead && // if another user's message and if is not read
                    <Box
                      height={20}
                      display='flex'
                      justifyContent='center'
                      borderRadius='5px'
                      sx={{
                        backgroundColor: theme.palette.primary.dark,
                        color: 'white'
                      }}
                    >New</Box>
                  }
                </Paper>
              </Box>
            </>
            : 'No comments' // if no messages - no comments
            }
          </Box>
        }
      />
    </Card>
  )
}

export default ChatCard