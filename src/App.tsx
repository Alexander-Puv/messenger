import { Experimental_CssVarsProvider as MUIThemes, Container} from '@mui/material'
import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { AppRouter, Navbar } from './components'
import { Loading } from './components/UI'
import AppContext from './context/AppContext'

function App() {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isAuth, setIsAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('auth')) {
      setIsAuth(true);
    }
    setIsLoading(false)
  }, [])

  return (
    <MUIThemes defaultMode="dark">
        <AppContext.Provider value={{
          isAuth, setIsAuth
        }}>
          <Container >
            {!isLoading ?
                <BrowserRouter>
                  <Navbar username={username} avatar={avatar} />
                  <AppRouter />
                </BrowserRouter>
            :
              <Loading />
            }
          </Container>
        </AppContext.Provider>
    </MUIThemes>
  )
}

export default App
