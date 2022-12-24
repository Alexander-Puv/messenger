import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase, Paper, Typography } from '@mui/material';
import { DocumentData, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { UserChats } from './';
import { ChatCard, Loader } from './UI';

const Sidebar = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState('')
  const [foundUser, setFoundUser] = useState<null | DocumentData>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<false | string>(false)
  console.log(foundUser);

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
        
        // check if the chat exists, if not, create it
        if (!res.exists()) {
          await setDoc(doc(firestore, 'chats', combinedId), {messages: []})

          // create user chats
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
        {/* if the user is serching for somebody and the data is still loading, shows loader */}
        {loading ? <Box display='flex' alignItems='center'><Loader /></ Box> :
          // if the user is found, show them
          foundUser ?
            <ChatCard
              photoURL={foundUser.photoURL}
              displayName={foundUser.displayName}
              content=''
              onClick={handleSelect}
              anotherUser={foundUser}
            />
          :
            // if no user or some error occured, show error
            error ?
              <Box display='flex' justifyContent='center'><Typography>{error}</Typography></ Box>
            :
              // if the user is not searching for anybody, show all their chats
              <UserChats />
        }
      </Box>
    </Box>
  )
}

export default Sidebar