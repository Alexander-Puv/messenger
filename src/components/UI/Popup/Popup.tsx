import { Alert, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../MainConf';
import { greenColor, redColor } from '../../../utils/colors';
import { LOGOUT } from '../../../utils/navbarSettings';
import { NavbarContext } from '../../Navbar';

interface PopupContextProps {
  successMessage: string,
  setSuccessMessage: (prop: string) => void,
  errorMessage: string,
  setErrorMessage: (prop: string) => void
}

export const PopupContext = createContext<PopupContextProps>({
  successMessage: '',
  setSuccessMessage: () => {},
  errorMessage: '',
  setErrorMessage: () => {}
})

export interface PopupProps {
  title: string,
  content: string | JSX.Element,
  btnText: string,
  secondBtnProps?: ButtonProps,
  navbarPopup?: boolean,
  props?: DialogProps
}

export default function Popup({title, content, btnText, secondBtnProps, navbarPopup, props}: PopupProps) {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [open, setOpen] = useState(props?.open ?? true)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const context = useContext(NavbarContext)
  const contentRef = useRef(null)
  
  if (!user) {
    return <p>Probably you broke up everything because I have no idea how you get here and there is no 'user' property</p>
  }
  

  useEffect(() => {
    // this useEffect is changing Popup visibility if it is changing inside another function
    props && setOpen(props.open)
  }, [props?.open])

  const handleClose = () => {
    setOpen(false);
    navbarPopup && context?.setPopup(null)
  };

  const onSecondBtnClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (title === LOGOUT) await context?.auth.signOut()
    secondBtnProps?.onClick && secondBtnProps.onClick(e)
    handleClose()
  }

  return (
    <PopupContext.Provider value={{
      successMessage, setSuccessMessage,
      errorMessage, setErrorMessage
    }}>
    <div>
      {/* popup */}
      <Dialog
        {...props}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent ref={contentRef}>
          {typeof content === 'string' ?
            <DialogContentText>
              {content}
            </DialogContentText>
          :
            content
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>{btnText}</Button>
          {secondBtnProps &&
            <Button
              onClick={onSecondBtnClick}
              {...secondBtnProps}
            />
          }
        </DialogActions>
      </Dialog>
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
    </div>
    </PopupContext.Provider>
  );
}