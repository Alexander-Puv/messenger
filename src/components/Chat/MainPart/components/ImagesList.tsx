import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef, useContext, useEffect } from 'react';
import { ChatContext } from '../../../../reducer/ChatReducer/ChatContext';

interface ImagesListProps {
  img: File,
  index: number,
  itemNumber: number
  setItemNumber: (i: number) => void
}

const ImagesList = ({img, index, itemNumber, setItemNumber}: ImagesListProps) => {
  const chatContext = useContext(ChatContext)
  const theme = useTheme()

  const removeImg = (index: number) => {
    if (!chatContext?.images) return // always false
    const splicedImages = [
      ...chatContext.images.slice(0, index),
      ...chatContext.images.slice(index + 1)
    ]
    chatContext.setImages(splicedImages)
  }

  return (
    <Box
      width={85} height={85}
      display='flex' position='relative' p='5px'
      border={`1px solid ${itemNumber === index ? theme.palette.primary.dark : 'transparent'}`}
      sx={{
        'img': {maxWidth: '100%', maxHeight: '100%', m: 'auto'},
        '&:hover svg': {opacity: 1}
      }} >
        <img
          src={URL.createObjectURL(img)} alt=""
          onClick={() => setItemNumber(index)}
          draggable={false}
        />
        <CloseIcon
          sx={{
            position: 'absolute', top: 5, right: 5, opacity: 0, cursor: 'pointer',
            transition: `${theme.transitions.duration.shortest}ms ease`
          }}
          onClick={() => removeImg(index)}
        />
    </Box>
  )
}

export default ImagesList