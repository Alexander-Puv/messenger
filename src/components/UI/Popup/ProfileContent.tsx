import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { updatePhoneNumber } from 'firebase/auth';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../MainConf';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';

interface Item {
  title: string,
  primary: string,
  textField: JSX.Element,
  icon: JSX.Element
}

const ProfileContent = () => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')

  const changePhoto = () => {
  }

  const changePhoneNumber = () => {
    // updatePhoneNumber(user, )
  }

  if (!user) {
    return <p>Probably you broke up everything because I have no idea how you get here and there is no 'user' property</p>
  }

  const Items: Item[] = [
    {
      title: user.phoneNumber ? 'Change phone number' : 'Add phone number',
      primary: user.phoneNumber ?? 'Add phone number',
      textField: <TextField
        value={phoneNumber}
        onChange={e => setPhoneNumber(e.target.value)}
        type='number'
      />,
      icon: <PhoneIcon />
    },
    {
      title: 'Change email',
      primary: user.email ?? '',// email could not be null
      textField: <TextField
        value={email}
        onChange={e => setEmail(e.target.value)}
        type='email'
      />,
      icon: <EmailIcon />
    }
  ]

  return (
    <List sx={{minWidth: 400}}>
      {/* user photo */}
      <ListItem>
        <Tooltip title='Choose photo' sx={{m: 'auto'}}>
          <IconButton onClick={changePhoto}>
            <Avatar
              src={user.photoURL ?? ''}
              alt='Choose photo'
              sx={{height: 100, width: 100}}
            />
          </IconButton>
        </Tooltip>
      </ListItem>
      {Items.map(item =>
        <ListItem key={item.title}>
          <Accordion sx={{width: '100%', backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none'}}>
            <AccordionSummary sx={{'.MuiAccordionSummary-content': {m: '0 !important'}}}>
              <ListItemButton title={item.title}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.primary}
                  sx={{textAlign: 'end'}}
                />
              </ListItemButton>
            </AccordionSummary>
            <AccordionDetails sx={{display: 'flex', flexDirection: 'column'}}>
              {item.textField}
            </AccordionDetails>
          </Accordion>
        </ListItem> 
      )}
    </List>
  )
}

export default ProfileContent