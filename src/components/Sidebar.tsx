import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Box, Card, CardHeader, IconButton, InputBase, Paper } from '@mui/material';
import { useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';

const chats = [
  {id: 0, img: '', title: 'somebody0', content: 'smth0'},
  {id: 1, img: '', title: 'somebody1', content: 'smth1'},
  {id: 2, img: '', title: 'somebody2', content: 'smth2'},
  {id: 3, img: '', title: 'somebody3', content: 'smth3'},
  {id: 4, img: '', title: 'somebody4', content: 'smth4'},
  {id: 5, img: '', title: 'somebody5', content: 'smth5'},
  {id: 6, img: '', title: 'somebody6', content: 'smth6'},
  {id: 7, img: '', title: 'somebody7', content: 'smth7'},
  {id: 8, img: '', title: 'somebody8', content: 'smth8'},
  {id: 9, img: '', title: 'somebody9', content: 'smth9'},
  {id: 10, img: '', title: 'somebody10', content: 'smth10'},
  {id: 11, img: '', title: 'somebody11', content: 'smth11'},
]

const Sidebar = () => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)

  return (
    <Box maxWidth={450} width='100%' display='flex' flexDirection='column' position='relative'>
      {/* Search */}
      <Paper
        component="form"
        sx={{ m: '10px 15px', p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for a chat"
        />
        <IconButton type="button" sx={{ m: 'auto' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      {/* Chats */}
      <Box sx={{overflowY: 'auto'}} position='absolute' top={64} bottom={0} left={15} right={0}>
        {chats.map(chat =>
          <Card key={chat.id}
            sx={{mt: 1, mr: '9px' /* 15px (standard margin) - 6px (scrollbar) */,
            p: 2, display: 'flex',
            '&:first-of-type': {mt: 0}
          }}>
            <CardHeader sx={{p: 0}}
              avatar={
                <Avatar src={chat.img} alt={chat.title} />
              }
              title={chat.title}
              subheader={chat.content}
            />
          </Card>
        )}
      </Box>
    </Box>
  )
}

export default Sidebar