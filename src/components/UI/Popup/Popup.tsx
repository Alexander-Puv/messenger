import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../MainConf';
import { greenColor, redColor } from '../../../utils/colors';
import { LOGOUT, SETTINGS } from '../../../utils/navbarSettings';
import { NavbarContext } from '../../Navbar';

export interface PopupProps {
  title: string,
  content: string | JSX.Element,
  btnText: string,
  props?: DialogProps
}

export default function Popup({title, content, btnText, props}: PopupProps) {
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [open, setOpen] = useState(props?.open ?? true);
  const context = useContext(NavbarContext)
  if (!user) return <></>

  useEffect(() => {
    // this useEffect is changing Popup visibility if it is changing inside another function
    props && setOpen(props.open)
  }, [props?.open])

  const handleClose = () => {
    setOpen(false);
    context?.setPopup(null)
  };

  const button = () => {
    switch (title) {
      case LOGOUT:
        return <Button
          onClick={async () => {await context?.auth.signOut(); handleClose()}}
          sx={{color: redColor}}
        >
          {title}
        </Button>

      case SETTINGS:
        return<Button onClick={handleClose} sx={{color: greenColor}}>
          Apply {/* or somthing else */}
        </Button>
    
      default:
        return <></>;
    } 
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
        <DialogContent>
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
          {button()}
        </DialogActions>
      </Dialog>
    </div>
  );
}