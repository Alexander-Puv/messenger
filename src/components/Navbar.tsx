import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Button, IconButton, Menu, MenuItem, Toolbar, Typography, Tooltip, Divider, Box } from '@mui/material';
import { red } from '@mui/material/colors';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { settings } from '../utils/navbarSettings';
import { createContext } from 'react'
import Popup, { PopupProps } from './UI/Popup';
import { Auth } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../utils/consts';

interface NavbarContextProps {
  popup: PopupProps | null,
  setPopup: (props: PopupProps | null) => void,
  auth: Auth
}

export const NavbarContext = createContext<NavbarContextProps | null>(null)

interface NavbarProps {
  username: string,
  avatar: string,
}

export default function Navbar({username, avatar}: NavbarProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [popup, setPopup] = useState<null | PopupProps>(null);
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  return (
    <NavbarContext.Provider value={{popup, setPopup, auth}}>
    <AppBar position="static">
      <Toolbar>
        {user ? <>
          <Tooltip title="Open settings">
            <IconButton
              size="large"
              color="inherit"
              sx={{ mr: 'auto' }}
              onClick={handleOpenUserMenu}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting.title} onClick={() => {handleCloseUserMenu(); setting.onClick({setPopup})}}>
                <Typography textAlign="center" sx={setting.title === 'Logout' ? {fontWeight: '500', color: red[700]} : {}}>
                  {setting.title}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
          <Tooltip title={user?.displayName}>
            <Avatar src={user.photoURL ? user.photoURL : ''} alt={user.displayName ? user.displayName : ''} />
          </Tooltip>
        </>
        : <Box display='flex' ml='auto'>
          <Button color="inherit">
            <Link to={LOGIN_ROUTE}>Login</Link>
          </Button>
          <Divider orientation="vertical" flexItem sx={{m: '0 5px'}} />
          <Button color="inherit">
            <Link to={SIGNUP_ROUTE}>Signup</Link>
          </Button>
        </Box>}
      </Toolbar>
    </AppBar>
    {popup && <Popup text={popup.text} title={popup.title} btnText={popup.btnText} />}
    </NavbarContext.Provider>
  );
}