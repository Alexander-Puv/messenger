import { CircularProgress, SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import { imgData } from '../../../../types/messageTypes'

interface ImageMessageProps {
  imgs: imgData[],
  boxRef: React.MutableRefObject<HTMLDivElement | null>
}

const ImageMessage = ({imgs, boxRef}: ImageMessageProps) => {
  const defImgStyles: SxProps<Theme> = {
    maxWidth: '100%', pointerEvents: 'none'
  }
  const imgStyles: SxProps<Theme> = ({})
  const [boxWidth, setBoxWidth] = useState(0)

  useLayoutEffect(() => {
    switch (imgs.length) {
      case 1:
        setBoxWidth(320)
        Object.assign(imgStyles, {p: 0})
        break;
      case 2:
        setBoxWidth(320)
        Object.assign(imgStyles, {p: 0})
        break;
      default:
        setBoxWidth(320)
        Object.assign(imgStyles, {p: 0})
        break;
    }
  }, [])

  return (
    <Box
      maxWidth={boxWidth}
      display='flex' flexWrap='wrap' justifyContent='center' gap='5px'
      sx={{'img': Object.assign(imgStyles, defImgStyles)}}
    >
      {imgs.map(img => {
        const [isLoaded, setIsLoaded] = useState(false)
        const newImg = new Image()
        newImg.src = img.url
        newImg.onload = () => {
          setIsLoaded(true)
          boxRef.current?.scrollIntoView({behavior: 'auto'})
        }

        const aspectRatio = img.imgProps.width / img.imgProps.height;
        const containerWidth = Math.min(boxWidth, img.imgProps.width);
        const containerHeight = containerWidth / aspectRatio;

        return (
          <Box
            width={containerWidth} height={containerHeight}
            display='flex' key={img.url}
          >
            {!isLoaded ?
              <CircularProgress sx={{m: 'auto'}} />
            : <img src={newImg.src} key={img.url} />
            }
          </Box>
        )
      })}
    </Box>
  )
}

export default ImageMessage