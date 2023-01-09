import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface ChatDateProps {
  date: string
}

const ChatDate = ({date}: ChatDateProps) => {
  return (
    <Box display='flex' m={1}>
      <Chip label={date} variant="outlined" sx={{m: 'auto'}}/>
    </Box>
  )
}

export default ChatDate