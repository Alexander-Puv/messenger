import { Grid } from '@mui/material';
import { Footer, MessagesField } from '../components';

const Chat = () => {
  
  return (
    <Grid container flex={1} p={1} maxHeight='100%' /* position='relative' */>
      <MessagesField />
      <Footer />
    </Grid>
  )
}

export default Chat