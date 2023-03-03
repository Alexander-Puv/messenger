import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { blue, blueGrey } from '@mui/material/colors'
import { useContext, useEffect, useLayoutEffect, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ImageMessage, VoiceMessage } from '.'
import { FirebaseContext } from '../../../../MainConf'
import { IMsg } from '../../../../types/messageTypes'

const Message = (msg: IMsg) => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const boxRef = useRef<HTMLDivElement | null>(null);
  const minutes = msg.createdAt.toDate().getMinutes()
  const isCurrentUser = user?.uid === msg.uid

  useLayoutEffect(() => {
    boxRef.current?.scrollIntoView({behavior: 'auto'})
  }, [msg])

  return (
    <Box m={1} ref={boxRef}>
      <Grid container sx={isCurrentUser ? {flexDirection: 'row-reverse'} : {}} flexWrap='nowrap'>
        <Avatar src={msg.photoURL ?? undefined} />
        {isCurrentUser ?
          <Box sx={{transform: 'translateX(-1px)', marginRight: '-1px'}}>
            <svg viewBox="0 0 8 13" width="8" height="13">
              <path fill={blue[200]} d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" />
            </svg>
          </Box>
        :
          <Box sx={{transform: 'translateX(1px)', marginRight: '1px'}}>
            <svg viewBox="0 0 8 13" height="13" width="8"  version="1.1">
              <path fill={blueGrey[400]} d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z" />
            </svg>
          </Box>
        }
        <Box
          maxWidth='80%'
          display='flex' flexDirection='column'
          alignItems={isCurrentUser ? 'flex-end' : 'flex-start'}
          gap={.5} p='4px 8px'
          border={'1px solid' + (isCurrentUser ? blue[200] : blueGrey[400])}
          borderRadius='7.5px'
          sx={{
            borderTopRightRadius: isCurrentUser ? 0 : 'auto',
            borderTopLeftRadius: isCurrentUser ? 'auto' : 0,
          }}
        >
          <Box
            display='flex'
            flexDirection={isCurrentUser ? 'row-reverse' : 'row'}
            width='100%'
            gap='10px'
            justifyContent='space-between'
          >
            <Typography variant='caption' component="h4">{msg.displayName}</Typography>
            <Typography variant='caption' component="h4">
              {msg.createdAt.toDate().getHours() + ':' + (minutes < 10 ? `0${minutes}` : minutes)}
            </Typography>
          </Box>
          {msg.imgs && <ImageMessage  imgs={Object.values(msg.imgs)} />}
          {msg.text && <Typography>{msg.text}</Typography>}
          {msg.audioData && <VoiceMessage audioData={msg.audioData} isLoading={msg.isLoading} />}
        </Box>
      </Grid>
    </Box>
  )
}

export default Message