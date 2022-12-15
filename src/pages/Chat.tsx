import Grid from '@mui/material/Grid';
import { Footer, MessagesField, Sidebar } from '../components';

const Chat = () => {
  
  return (
    <Grid container flex={1}>
      <Sidebar />
      <Grid container flex={1} position='relative'>
        <MessagesField />
        <Footer />
      </Grid>
    </Grid>
  )
}

export default Chat