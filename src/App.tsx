import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AppRouter, Navbar } from './components'

function App() {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const theme = useTheme()

  return (
    <Box sx={{
      background: theme.palette.background.default,
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      p: '20px 0',
      '@media (max-width: 1450px)': {
        p: 0,
      }
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
        <BrowserRouter>
          <Navbar username={username} avatar={avatar} />
          <Box component='main' sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: theme.palette.background.default,
            backgroundImage: 'linear-gradient(rgba(255 255 255 / 0.02), rgba(255 255 255 / 0.02))'
          }}>
            <AppRouter />
          </Box>
        </BrowserRouter>
      </Box>
    </Box>
  )
}

export default App
