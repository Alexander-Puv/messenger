import Button from '@mui/material/Button'
import { grey } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useContext } from 'react'
import { FirebaseContext } from '../MainConf'

const Login = () => {
  const {auth} = useContext(FirebaseContext)

  const login = async () => {
    const provider = new GoogleAuthProvider()
    const {user} = await signInWithPopup(auth, provider)
  }
  
  return (
    <Grid container m={'auto'} maxWidth={500} width='100%' maxHeight={250} height='100%' bgcolor={grey[900]}>
      <Button sx={{m: 'auto'}} variant='outlined' onClick={login}>Login with Google</Button>
    </Grid>
  )
}

export default Login