import { Box, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../../../reducer/ChatContext';
import { backgroundImage } from '../../../../utils/colors';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { MessageInput } from '../../../UI';

const DraggedImages = () => {
  const chatContext = useContext(ChatContext)
  if (!chatContext?.images) return <></> // always false
  const theme = useTheme()
  const [value, setValue] = useState('')
  const [itemNumber, setItemNumber] = useState(0)
  const [isDragged, setIsDragged] = useState(false)
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragged(true)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragged(false);
    }
  }
  
  const close = () => {
    chatContext.setImages(null)
  }

  const SendMessage = () => {}

  return (
    <Box
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={() => setIsDragged(false)}
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
      <IconButton sx={{position: 'absolute', top: 10, left: 10}} onClick={close}>
        <CloseIcon />
      </IconButton>
      <Box
        display='flex' maxHeight='100%'
        sx={{'img': {height: '100%', width: '100%', m: 'auto'}}}
      >
        <img src={URL.createObjectURL(chatContext.images[itemNumber])} alt="" />
      </Box>
      <Box></Box>
      {/* if isDragged */}
      <Box
        position='absolute' display='flex'
        width='100%' height='100%'
        zIndex={isDragged ? 2 : -1}
      >
        <Box
          display='flex' m={'auto'}
          width={isDragged ? '100%' : 0} height={isDragged ? '100%' : 0}
          sx={{
            background: `${theme.palette.background.default}80`,
            transition: `${theme.transitions.duration.shortest}ms ease`
          }}
        >
          {isDragged &&
            <Typography sx={{m: 'auto'}} variant="h2">
              Drop files here
            </Typography>
          }
        </Box>
      </Box>
    </Box>
  )
}

export default DraggedImages