import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import AppContext from '../context/AppContext';

const settings = ['Profile', 'Settings', 'FAQ', 'Logout']

interface NavbarProps {
  username: string,
  avatar: string,
}

export default function Navbar({username, avatar}: NavbarProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const context = useContext(AppContext);

  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {context?.isAuth ? <>
          <IconButton
            size="large"
            color="inherit"
            sx={{ mr: 'auto' }}
            onClick={handleOpenUserMenu}
          >
            <MenuIcon />
          </IconButton>
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
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
          <Avatar alt={username} src={avatar} />
        </>
        : <Button color="inherit" sx={{ml: 'auto'}}>Login</Button>}
      </Toolbar>
    </AppBar>
  );
}