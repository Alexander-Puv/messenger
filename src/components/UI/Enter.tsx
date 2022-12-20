import GoogleIcon from '@mui/icons-material/Google';
import { Button, Grid, TextField, Typography, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/consts';

interface Input {
  label: string,
  value: string,
  onChange: (value: string) => void
}

interface EnterProps {
  inputs: Input[],
  confirm: (/* e?: React.MouseEvent<HTMLButtonElement, MouseEvent> */) => void,
  gooole: () => void,
  error: boolean
}

const Enter = ({inputs, confirm, gooole, error}: EnterProps) => {
  const theme = useTheme()
  const path = location.pathname.charAt(1).toUpperCase() + location.pathname.slice(2)

  return (
    <Grid container flexDirection='column' m={'auto'} p={2} maxWidth={500} width='100%' bgcolor={grey[900]}>
      <Grid container flexDirection='column'>
        {inputs.map(input =>
          <TextField
            label={input.label}
            value={input.value}
            onChange={e => input.onChange(e.target.value)}
            key={input.label}
            sx={{mb: '10px'}}
            type={input.label}
          />
        )}
        <Button sx={{m: '5px auto 0'}} variant='outlined' onClick={confirm}>{path}</Button>
        {error && <Typography mt={1} alignSelf='center' color={theme.palette.error.main}>Somthing went wrong. Check the fields again</Typography>}
      </Grid>
      <Button sx={{m: 3, display: 'flex', alignSelf: 'center', alignItems: 'center'}} onClick={gooole}>
        <Typography>Or {path} with </Typography>
        <GoogleIcon sx={{fill: theme.palette.primary.main}}/>
      </Button>
      <Grid container>
        <Typography sx={{'& a': {color: theme.palette.primary.main}}} alignSelf='center'>
          {path === 'Login' ?
            <>
              Don't have an account? 
              <Link to={SIGNUP_ROUTE}>Signup!</Link>
            </>
          :
            <>
              Already have an account? 
              <Link to={LOGIN_ROUTE}>Login!</Link>
            </>
          }
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Enter