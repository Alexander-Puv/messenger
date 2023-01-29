import AttachFileIcon from '@mui/icons-material/AttachFile';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import useTheme from '@mui/material/styles/useTheme';
import { useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Attach = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} sx={{color: theme.palette.text.secondary}}>
        <AttachFileIcon sx={{transform: 'rotate(225deg)'}} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {[1, 2].map(m =>
          <MenuItem onClick={handleClose} sx={{'&:hover': {backgroundColor: 'transparent'}}} key={m}>
            <Box display='flex' gap={1}>
              {[1, 2, 3].map(i =>
                <ImageIcon
                  sx={{
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                  key={i}
                />
              )}
            </Box>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

export default Attach