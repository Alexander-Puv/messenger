import ContactMailIcon from '@mui/icons-material/ContactMail';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import BadgeIcon from '@mui/icons-material/Badge';
import { Alert, Avatar, Box, IconButton, List, ListItem, Snackbar, TextField, Tooltip } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { PhoneAuthProvider, RecaptchaVerifier, updateEmail, updatePhoneNumber, updateProfile } from 'firebase/auth';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ListInputItem, Popup } from '../../';
import { FirebaseContext } from '../../../../MainConf';
import { greenColor, redColor } from '../../../../utils/colors';
import ProfilePhoto from './ProfilePhoto';

const ProfileContent = () => {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  if (!user) return <></>

  const [username, setUsername] = useState('')

  const applyUsername = () => {
    updateProfile(user, {displayName: username}).
      then(() => {
        setSuccessMessage('Your username successfully changed')
      }).catch((e) => {
        e instanceof FirebaseError && setErrorMessage(e.message)
      })
  }
  const cancelUsername = () => {
    setUsername('')
  }


  const [open, setOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
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
    } catch (e) {
      console.log(e);
      e instanceof FirebaseError && setErrorMessage(e.message);
    }
  }

  const verifyCode = async () => {
    try {
      const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await updatePhoneNumber(user, phoneCredential).
      then(() => {
        setSuccessMessage('Your phone number successfully changed')
      }).catch((e) => {
        e instanceof FirebaseError && setErrorMessage(e.message)
      })
    } catch (e) {
      e instanceof FirebaseError && setErrorMessage(e.message);
    }
  }

  const cancelPhoneNumber = () => {
    setPhoneNumber('')
  }



  const [email, setEmail] = useState('')

  const applyEmail = async () => {
    await updateEmail(user, email).
      then(() => {
        setSuccessMessage('Your email successfully changed')
      }).catch((e) => {
        e instanceof FirebaseError && setErrorMessage(e.message)
      })
  }
  const cancelEmail = () => {
    setEmail('')
  }

  return (
    <List sx={{minWidth: 400}}>
      {/* user photo */}
      <ProfilePhoto />
      {/* username */}
      <ListInputItem cancel={cancelUsername} apply={applyUsername} item={{
        title: 'Change username',
        primary: user.displayName ?? '', // displayName could not be null
        textField: <TextField
        value={username}
        onChange={e => setUsername(e.target.value)}
        />,
        icon: <BadgeIcon />
      }} />
      {/* user phone number */}
      <ListInputItem cancel={cancelPhoneNumber} apply={() => setOpen(true)} item={{
        title: user.phoneNumber ? 'Change phone number' : 'Add phone number',
        primary: user.phoneNumber ?? 'Add phone number',
        textField: <TextField
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          type='tel'
        />,
        icon: <ContactPhoneIcon />
      }} />
      <Popup
        title='check' props={{open}} btnText='Nope'
        content={<>
          <TextField
            sx={{display: 'flex', width: '100%', mb: 1}}
            value={verificationCode} onChange={e => setVerificationCode(e.target.value)}
          />
          <Box id='recaptcha-container' sx={{display: 'flex', justifyContent: 'center'}} ref={reRef}></Box>
        </>}
        secondBtnProps={{sx: {color: greenColor}, children: 'Apply'}}
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
        icon: <ContactMailIcon />
      }} />
      {/* success or error */}
      <Snackbar
        open={successMessage || errorMessage ? true : false}
        autoHideDuration={5000}
        onClose={() => {setErrorMessage(''); setSuccessMessage('')}}
      >
        {successMessage ?
          <Alert severity="success" sx={{backgroundColor: greenColor}}>{successMessage}</Alert>
        : errorMessage ?
          <Alert severity="error" sx={{backgroundColor: redColor}}>{errorMessage}</Alert>
        : <Alert/>
        }
      </Snackbar>
    </List>
  )
}

export default ProfileContent