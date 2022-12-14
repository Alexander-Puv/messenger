import Button from '@mui/material/Button';
import red from '@mui/material/colors/red';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useContext } from 'react';
import { NavbarContext } from '../Navbar';

export interface PopupProps {
  title: string,
  text: string,
  btnText: string,
}

export default function Popup({title, text, btnText}: PopupProps) {
  const [open, setOpen] = useState(true);
  const context = useContext(NavbarContext)

  const handleClose = () => {
    setOpen(false);
    context?.setPopup(null)
  };

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
          <DialogContentText>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>{btnText}</Button>
          {title === 'Logout' && <Button
            onClick={async () => {await context?.auth.signOut(); handleClose()}}
            sx={{color: red[700]}}
          >
            {title}
          </Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
}