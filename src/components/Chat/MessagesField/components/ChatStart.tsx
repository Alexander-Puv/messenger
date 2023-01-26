import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ChatStart = () => {
  return (
    <Paper sx={{display: 'flex', maxWidth: 650, p: 2, my: 2, mx: 'auto'}}>
      <Typography sx={{m: 'auto'}} textAlign='center'>
        This is the start of your conversation. Who knows, maybe in years you will remember it with warmth. Or curse it.
      </Typography>
    </Paper>
  )
}

export default ChatStart