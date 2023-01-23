import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { Box, TextField } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { PhoneAuthProvider, RecaptchaVerifier, updatePhoneNumber } from 'firebase/auth';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../../../../MainConf';
import ListInputItem from '../../../../ListInputItem';
import Popup, { PopupContext } from '../../../Popup';
import { greenColor } from '../../../../../../utils/colors';

const Phone = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const {setErrorMessage, setSuccessMessage} = useContext(PopupContext)

  if (!user) return <></>

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
      await updatePhoneNumber(user, phoneCredential)
      setSuccessMessage('Your phone number successfully changed')
      setPhoneNumber('')
    } catch (e) {
      e instanceof FirebaseError && setErrorMessage(e.message);
    }
  }

  const cancelPhoneNumber = () => {
    setPhoneNumber('')
  }
  return <>
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
  </>
}

export default Phone