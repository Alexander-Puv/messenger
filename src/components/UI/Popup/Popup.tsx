import Button, { ButtonProps } from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../MainConf';
import { greenColor, redColor } from '../../../utils/colors';
import { LOGOUT, SETTINGS } from '../../../utils/navbarSettings';
import { NavbarContext } from '../../Navbar';

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
  const [open, setOpen] = useState(props?.open ?? true);
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

  const onSecondBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!secondBtnProps) return
    if (title === LOGOUT) async () => await context?.auth.signOut()
    secondBtnProps.onClick && secondBtnProps.onClick(e)
    handleClose()
  }

  return (
    <div>
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
    </div>
  );
}