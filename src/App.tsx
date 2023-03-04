import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useContext, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { FirebaseContext } from './MainConf'
import { AppRouter, Navbar } from './components'
import { backgroundImage } from './utils/colors'
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore'
import { IMsg } from './types/messageTypes'
import { ISidebarChat } from './types/sidebaarChatTypes'

function App() {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user, loading] = useAuthState(auth)
  const theme = useTheme()

  // useEffect(() => {
    // const addChecks = async () => {
      // const userQuery = query(collection(firestore, 'chats'))
      // const userSnapshot = await getDocs(userQuery)
    
      // userSnapshot.forEach(async (d) => {
      //   const updatedMessages = d.data().messages.map((msg: IMsg) => {
      //     return {
      //       ...msg,
      //       isRead: true
      //     }
      //   })

      //   await updateDoc(doc(firestore, 'chats', d.id), {
      //     messages: updatedMessages
      //   })
      // })

      // const userChatsQuery = query(collection(firestore, 'userChats'))
      // const userChatsSnapshot = await getDocs(userChatsQuery)

      // userChatsSnapshot.forEach(async (d) => {
      //   const chatId = Object.keys(d.data());
        
      //   chatId.map(async (thisId) => {
      //     await updateDoc(doc(firestore, 'userChats', d.id), {
      //       [`${thisId}.lastMessage.myMsg`]: true
      //     })
      //   })
      // })
    // }

    // addChecks()
  // }, [])

  return (
    <Box sx={{
      background: theme.palette.background.default,
      flex: 1, display: 'flex', justifyContent: 'center',
      p: '20px 0',
      '@media (max-width: 1450px)': {
        p: 0,
      },
      overflow: 'hidden', userSelect: 'none'
    }}>
      <Box sx={{color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1400,
        width: '100%'
      }}>
        {loading ? <CircularProgress sx={{m: 'auto'}} />
        :
          <BrowserRouter>
            <Navbar />
            <Box component='main' sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: theme.palette.background.default,
              backgroundImage: backgroundImage
            }}>
              <AppRouter />
            </Box>
          </BrowserRouter>
        }
      </Box>
    </Box>
  )
}

export default App
