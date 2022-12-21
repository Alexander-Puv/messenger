import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase, Paper, Typography } from '@mui/material';
import { DocumentData, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { Loader } from './UI';
import ChatCard from './UI/ChatCard';

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
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState('')
  const [foundUser, setFoundUser] = useState<null | DocumentData>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<false | string>(false)

  useEffect(() => {
    // remove error and found user if search input is empty
    if (!username) {
      setError(false)
      setFoundUser(null)
    }
  }, [username])
  
  
  const handleSearch = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    // if search input is empty don't do anything
    if (!username) return

    setLoading(true)

    const q = query(collection(firestore, 'users'), where('displayName', '==', username))

    try {
      const querySnapshot = await getDocs(q);
      //if there is user, show them
      querySnapshot.forEach((doc) => {
        setFoundUser(doc.data())
      });
      //if no found user, set error
      querySnapshot.empty && setError('User not found')
    } catch (e) {
      setError('Somthing went wrong')
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.code === 'Enter' && handleSearch(e)
  }

  const handleSelect = async () => {
    // user and foundUser are anyway defined in this case
    // but this is TypeScript and who loves when everything's red?
    if (user && foundUser) {
      const combinedId = user.uid > foundUser.uid
        ? user.uid + foundUser.uid
        : foundUser.uid + user.uid
      try {
        const res = await getDoc(doc(firestore, 'chats', combinedId))
        
        if (!res.exists()) {
          await setDoc(doc(firestore, 'chats', combinedId), {messages: []})

          await updateDoc(doc(firestore, 'userChats', user.uid), {
            [combinedId + '.userInfo']: {
              uid: foundUser.uid,
              displayName: foundUser.displayName,
              photoURL: foundUser.photoURL
            },
            [combinedId + '.date']: serverTimestamp()
          })

          await updateDoc(doc(firestore, 'userChats', foundUser.uid), {
            [combinedId + '.userInfo']: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL
            },
            [combinedId + '.date']: serverTimestamp()
          })
        }
      } catch (e) {
        console.log(e);
      }

      setFoundUser(null)
      setUsername("")
    }
  }

  return (
    <Box maxWidth={'35%'} width='100%' display='flex' flexDirection='column' position='relative'>
      {/* Search */}
      <Paper
        component="form"
        sx={{ m: '10px 15px', p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for a chat"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => handleKeyDown(e)}
        />
        <IconButton type="button" sx={{ m: 'auto' }} onClick={e => handleSearch(e)}>
          <SearchIcon />
        </IconButton>
      </Paper>
      {/* Chats */}
      <Box sx={{overflowY: 'auto'}} position='absolute' top={64} bottom={0} left={15} right={0}>
        {loading ? <Box display='flex' alignItems='center'><Loader /></ Box> :
          foundUser ?
            <ChatCard img={foundUser.photoURL} title={foundUser.displayName} content='No messages' onClick={handleSelect} />
          :
            error ?
              <Box display='flex' justifyContent='center'><Typography>{error}</Typography></ Box>
            :
              chats.map(chat =>
                <ChatCard {...chat} key={chat.id} />
              )
        }
      </Box>
    </Box>
  )
}

export default Sidebar