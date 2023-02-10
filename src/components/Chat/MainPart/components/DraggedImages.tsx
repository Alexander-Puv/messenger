import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { Box, Typography, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useContext, useMemo, useState } from 'react';
import { ChatContext } from '../../../../reducer/ChatContext';
import { backgroundImage } from '../../../../utils/colors';
import { AttachFile, MessageInput } from '../../../UI';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';

const DraggedImages = () => {
  const chatContext = useContext(ChatContext)
  if (!chatContext?.images) return <></> // always false
  const theme = useTheme()
  const [value, setValue] = useState('')
  const [itemNumber, setItemNumber] = useState(0)
  const [isDragged, setIsDragged] = useState(false)

  const imageUrl = useMemo(() => {
    if (!chatContext?.images) return '' // always false
    return URL.createObjectURL(chatContext.images[itemNumber]);
  }, [itemNumber]);
  
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

  const SendMessage = () => {
    if (!chatContext.images) return // always false
    chatContext.SendMessage({img: chatContext.images, value, setValue})
  }

  return (
    <Box
      onDragOver={onDragOver} onDragLeave={onDragLeave}
      onDrop={() => setIsDragged(false)}
      position='absolute' p={2.5}
      height='100%' width='100%'
      display='flex' flexDirection='column'
      justifyContent='space-between' 
      sx={{
        backgroundColor: theme.palette.background.default,
        backgroundImage: backgroundImage,
      }}
    >
      <IconButton sx={{position: 'absolute', top: 10, left: 10}} onClick={close}>
        <CloseIcon />
      </IconButton>
      <Box
        display='flex' flex={1} mb={2.5}
        sx={{
          background: `url(${imageUrl}) no-repeat center`,
          backgroundSize: 'contain'
        }}
      />
      <Box display='flex' mb={2.5} sx={{overflowX: 'auto'}}>
        <Box display='flex' m='0 auto' gap='5px'>
        {chatContext.images.map((img, i) =>
          <Box
          display='flex'
          sx={{'img': {
            boxSizing: 'content-box', p: '5px', maxHeight: 75,
            border: `1px solid ${itemNumber === i ? theme.palette.primary.dark : 'transparent'}`
          }}} key={i}>
            <img
              src={URL.createObjectURL(img)} alt=""
              onClick={() => setItemNumber(i)}
              draggable={false}
            />
          </Box>
        )}
        <Box
          display='flex' justifyContent='center'
          alignItems='center' width={87}
        >
          <AttachFile acceptFiles='.jpg, .webp, .jpeg, .png' Icon={AddPhotoIcon} />
        </Box>
        </Box>
      </Box>
      <Box display='flex'>
        <MessageInput {...{value, setValue, SendMessage}} />
        <IconButton>
          <SendIcon />
        </IconButton>
      </Box>
      {/* if isDragged */}
      <Box
        position='absolute' top={0} left={0}
        display='flex'
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