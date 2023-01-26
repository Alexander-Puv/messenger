import Grid from '@mui/material/Grid';
import { Sidebar, MainPart } from '../components';
import { ChatContextProvider } from '../reducer/ChatContext';

const Chat = () => {
  
  return (
    <ChatContextProvider>
    <Grid container flex={1}>
      <Sidebar />
      <MainPart />
    </Grid>
    </ChatContextProvider>
  )
}

export default Chat