import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar, Box, IconButton, List, ListItem, TextField, Tooltip } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { PhoneAuthProvider, RecaptchaVerifier, updateEmail, updatePhoneNumber } from 'firebase/auth';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListInputItem, Popup } from '../../';
import { FirebaseContext } from '../../../../MainConf';

const ProfileContent = () => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [verificationCode, setVerificationCode] = useState('')
  const [open, setOpen] = useState(false)

  if (!user) {
    return <p>Probably you broke up everything because I have no idea how you get here and there is no 'user' property</p>
  }

  const changePhoto = () => {
  }



  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationId, setVerificationId] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sendVerificationCode = async () => {
    const provider = new PhoneAuthProvider(auth);
    const applicationVerifier = new RecaptchaVerifier('recaptcha-container', {'size': 'normal'}, auth);
    try {
      const result = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
      setVerificationId(result);
      setIsCodeSent(true);
    } catch (error) {
      error instanceof FirebaseError && setErrorMessage(error.message);
    }
  }

  const verifyCode = async () => {
    try {
      const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await updatePhoneNumber(user, phoneCredential);
    } catch (error) {
      error instanceof FirebaseError && setErrorMessage(error.message);
    }
  }
  const cancelPhoneNumber = () => {
    setPhoneNumber('')
  }



  const [email, setEmail] = useState('')

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
      <ListInputItem cancel={cancelPhoneNumber} apply={isCodeSent ? verifyCode : sendVerificationCode} item={{
        title: user.phoneNumber ? 'Change phone number' : 'Add phone number',
        primary: user.phoneNumber ?? 'Add phone number',
        textField: <TextField
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          type='tel'
        />,
        icon: <PhoneIcon />
      }} />
      <Popup title='check' props={{open}} content={
        <></>
      } btnText='YUP' />
      <TextField value={verificationCode} onChange={e => setVerificationCode(e.target.value)} />
      <Box id='recaptcha-container' sx={{display: 'flex', justifyContent: 'center'}}></Box>
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