import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Button, IconButton, Menu, MenuItem, Toolbar, Typography, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../MainConf';
import { settings } from '../utils/navbarSettings';

interface NavbarProps {
  username: string,
  avatar: string,
}

export default function Navbar({username, avatar}: NavbarProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const {auth} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  return (
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
              <MenuItem key={setting.title} onClick={handleCloseUserMenu}>
                <Typography textAlign="center" onClick={() => setting.onClick({auth})}>{setting.title}</Typography>
              </MenuItem>
            ))}
          </Menu>
          <Tooltip title={user?.displayName}>
            <Avatar src={user.photoURL ? user.photoURL : ''} alt={user.displayName ? user.displayName : ''} />
          </Tooltip>
        </>
        : <Button color="inherit" sx={{ml: 'auto'}}>Login</Button>}
      </Toolbar>
    </AppBar>
  );
}