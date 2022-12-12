import { Avatar, Box, Grid, Typography } from '@mui/material';
import { blue, blueGrey } from '@mui/material/colors';
import { addDoc, collection, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Loader } from '../components/UI';
import { FirebaseContext } from '../MainConf';

const MessagesField = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [messages, loading] = useCollectionData(query(collection(firestore, 'messages'), orderBy("createdAt")))

  if (loading) {
    return <Loader />
  }

  return (
    <Box sx={{overflowY: 'auto'}} width='100%' maxHeight='calc(100vh - 120px)' height='100%'/*  position='absolute' */>
      {messages?.map(msg =>
        <Box key={msg.createdAt} m={1}>
          <Grid container sx={user?.uid === msg.uid ? {flexDirection: 'row-reverse'} : {}}>
            <Avatar src={msg.photoURL} />
            <Box sx={user?.uid === msg.uid ?
            {transform: 'translateX(-1px)', marginRight: '-1px'} :
            {transform: 'translateX(1px)', marginRight: '1px'}}>
              <svg viewBox="0 0 8 13" width="8" height="13">
                <path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
                <path fill={user?.uid === msg.uid ? blue[200] : blueGrey[400]} d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" />
              </svg>
            </Box>
            <Box display='flex' flexDirection='column' gap={.5} p='4px 8px' alignItems='flex-end'
              sx={{
                position: 'relative',
                border: '1px solid ' + (user?.uid === msg.uid ? blue[200] : blueGrey[400]),
                borderRadius: '7.5px',
                borderTopRightRadius: user?.uid === msg.uid ? 0 : 'auto',
                borderLeftRightRadius: user?.uid === msg.uid ? 'auto' : 0,
              }}
            >
              <Typography variant='caption' component="h4">{msg.displayName}</Typography>
              <Typography>{msg.text}</Typography>
            </Box>
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default MessagesField