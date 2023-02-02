import { Box, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../../../reducer/ChatContext';
import { backgroundImage } from '../../../../utils/colors';
import CloseIcon from '@mui/icons-material/Close';

const DraggedImages = () => {
  const chatContext = useContext(ChatContext)
  const theme = useTheme()
  const [itemNumber, setItemNumber] = useState(0)
  if (!chatContext?.images) return <></> // always false

  return (
    <Box
      position='absolute' width='100%' height='100%'
      display='flex' flexDirection='column'
      sx={{
        backgroundColor: theme.palette.background.default,
        backgroundImage: backgroundImage,
        'img': {
          pointerEvents: 'none'
        }
      }}
    >
      <CloseIcon sx={{position: 'absolute', top: 10, left: 10}} />
      <Box
        display='flex' height='100%'
        sx={{'img': {height: '100%', width: '100%', m: 'auto'}}}
      >
        <img src={URL.createObjectURL(chatContext.images.item(itemNumber))} alt="" />
      </Box>
    </Box>
  )
}

export default DraggedImages