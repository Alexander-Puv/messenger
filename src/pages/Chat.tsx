import Grid from '@mui/material/Grid';
import { Footer, MessagesField, Sidebar } from '../components';
import { ChatContextProvider } from '../reducer/ChatContext';

const Chat = () => {
  
  return (
    <ChatContextProvider>
    <Grid container flex={1}>
      <Sidebar />
      <Grid container flex={1} position='relative'>
        <MessagesField />
        <Footer />
      </Grid>
    </Grid>
    </ChatContextProvider>
  )
}

export default Chat