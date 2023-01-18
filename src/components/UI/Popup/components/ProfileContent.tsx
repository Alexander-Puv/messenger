import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar, Box, IconButton, List, ListItem, TextField, Tooltip } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { PhoneAuthProvider, RecaptchaVerifier, updateEmail, updatePhoneNumber } from 'firebase/auth';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListInputItem, Popup } from '../../';
import { FirebaseContext } from '../../../../MainConf';

const ProfileContent = () => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)

  if (!user) return <></>

  const changePhoto = () => {
  }



  const [open, setOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const reRef = useRef(null)

  useEffect(() => {
    reRef.current && sendVerificationCode()
  }, [reRef.current])

  const sendVerificationCode = async () => {
    console.log(true);
    
    const provider = new PhoneAuthProvider(auth);
    const applicationVerifier = new RecaptchaVerifier('recaptcha-container', {'size': 'normal'}, auth);
    try {
      const result = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
      setVerificationId(result);
      setIsCodeSent(true);
    } catch (error) {
      console.log(error);
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
      <ListInputItem cancel={cancelPhoneNumber} apply={() => setOpen(true)} item={{
        title: user.phoneNumber ? 'Change phone number' : 'Add phone number',
        primary: user.phoneNumber ?? 'Add phone number',
        textField: <TextField
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          type='tel'
        />,
        icon: <PhoneIcon />
      }} />
      <Popup
        title='check' props={{open}}
        content={<>
          <TextField
            sx={{display: 'flex', width: '100%', mb: 1}}
            value={verificationCode} onChange={e => setVerificationCode(e.target.value)}
          />
          <Box id='recaptcha-container' sx={{display: 'flex', justifyContent: 'center'}} ref={reRef}></Box>
        </>}
        btnText='Nope' btnOnClick={verifyCode}
      />
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