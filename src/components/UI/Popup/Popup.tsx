import Button from '@mui/material/Button';
import green from '@mui/material/colors/green';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useContext } from 'react';
import { NavbarContext } from '../../Navbar';
import { LOGOUT, PROFILE, SETTINGS } from '../../../utils/navbarSettings';
import { greenColor, redColor } from '../../../utils/colors';

export interface PopupProps {
  title: string,
  content: string | JSX.Element,
  btnText: string,
}

export default function Popup({title, content, btnText}: PopupProps) {
  const [open, setOpen] = useState(true);
  const context = useContext(NavbarContext)

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

      case PROFILE:
        return<Button sx={{color: greenColor}}>
          Apply {/* or somthing else */}
        </Button>

      case SETTINGS:
        return<Button sx={{color: greenColor}}>
          Apply {/* or somthing else */}
        </Button>
    
      default:
        return <></>;
    } 
  }

  return (
    <div>
      <Dialog
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