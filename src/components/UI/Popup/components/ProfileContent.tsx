import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar, IconButton, List, ListItem, TextField, Tooltip } from '@mui/material';
import { PhoneAuthProvider, RecaptchaVerifier, updateEmail, updatePhoneNumber } from 'firebase/auth';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListInputItem, Popup } from '../../';
import { FirebaseContext } from '../../../../MainConf';

const ProfileContent = () => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  if (!user) {
    return <p>Probably you broke up everything because I have no idea how you get here and there is no 'user' property</p>
  }

  

  const changePhoto = () => {
  }

  const applyPhoneNumber = async () => {
    <Popup title='check' content={
      <TextField id='WTF' value={verificationCode} onChange={e => setVerificationCode(e.target.value)} />
    } btnText='YUP' />
    // 'recaptcha-container' is the ID of an element in the DOM.
    const applicationVerifier = new RecaptchaVerifier('WTF', {}, auth);
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
    const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
    
    await updatePhoneNumber(user, phoneCredential);
  }
  const cancelPhoneNumber = () => {
    setPhoneNumber('')
  }

  const applyEmail = async () => {
    await updateEmail(user, email)
  }
  const cancelEmail = () => {
    setEmail('')
  }

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
      {/* user phone number */}
      <ListInputItem cancel={cancelPhoneNumber} apply={applyPhoneNumber} item={{
        title: user.phoneNumber ? 'Change phone number' : 'Add phone number',
        primary: user.phoneNumber ?? 'Add phone number',
        textField: <TextField
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          type='tel'
        />,
        icon: <PhoneIcon />
      }} />
      {/* user email */}
      <ListInputItem cancel={cancelEmail} apply={applyEmail} item={{
        title: 'Change email',
        primary: user.email ?? '', // email could not be null
        textField: <TextField
          value={email}
          onChange={e => setEmail(e.target.value)}
          type='email'
        />,
        icon: <EmailIcon />
      }} />
    </List>
  )
}

export default ProfileContent