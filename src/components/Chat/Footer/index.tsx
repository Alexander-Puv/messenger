import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import { Box, Grid, IconButton } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import { useContext, useState } from 'react';
import { ChatContext } from '../../../reducer/ChatContext';
import { AttachFile, MessageInput } from '../../UI';
import { Record } from './components';

const Footer = () => {
  const [value, setValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const chatContext = useContext(ChatContext)
  const theme = useTheme()

  const SendMessage = () => {
    isRecording && setIsRecording(false)
    chatContext?.SendMessage({value, setValue})
  }

  return (
    <Grid
      container alignSelf='flex-end'
      component='footer' position='absolute'
      sx={{
        bottom: 0, right: 0,
        background: theme.palette.background.default,
        backgroundImage: 'linear-gradient(rgba(255 255 255 / 0.02), rgba(255 255 255 / 0.02))'
      }}
      p={1} gap={1}
    >
      <AttachFile Icon={ImageIcon} acceptFiles='.jpg, .webp, .jpeg, .png' />
      <MessageInput {...{value, setValue, SendMessage}} />
      <Box display='flex' alignItems='flex-end'>
        {value ? // if the user wrote somthing, shows send button
          <IconButton onClick={() => SendMessage()} sx={{color: theme.palette.primary.main}}>
            <SendIcon />
          </IconButton>
        : // otherwise shows the voice message button
          <Record
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        }
      </Box>
    </Grid>
  )
}

export default Footer