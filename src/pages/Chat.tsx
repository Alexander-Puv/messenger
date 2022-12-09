import { useTheme, Box } from '@mui/material'

const Chat = () => {
  const theme = useTheme()
  
  return (
    <Box component='main' sx={{background: theme.palette.background.default}}>
      Chat
    </Box>
  )
}

export default Chat