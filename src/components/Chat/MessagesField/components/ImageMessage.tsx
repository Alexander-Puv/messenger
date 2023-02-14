import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import { useEffect, useLayoutEffect, useState } from 'react'
import { imgData } from '../../../../types/messageTypes'

interface ImageMessageProps {
  imgs: imgData[],
  boxRef: React.MutableRefObject<HTMLDivElement | null>
}

const ImageMessage = ({imgs, boxRef}: ImageMessageProps) => {
  const defImgStyles: SxProps<Theme> = {
    maxWidth: 'calc(100% - 10px)', m: '5px', pointerEvents: 'none'
  }
  const imgStyles: SxProps<Theme> = ({})
  const [boxWidth, setBoxWidth] = useState(0)
  const images = Object.values(imgs)
  const [loadingImgs, setLoadingImgs] = useState(Array(images.length).fill(false))

  useLayoutEffect(() => {
    switch (images.length) {
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

  useLayoutEffect(() => {
    boxRef.current?.scrollIntoView({behavior: 'auto'})
  }, [loadingImgs])
  
  return (
    <Box
      maxWidth={boxWidth}
      display='flex' flexWrap='wrap' justifyContent='center'
      sx={{'img': Object.assign(imgStyles, defImgStyles)}}
    >
      {images.map((img, i) =>
        <img
          src={img.url} key={img.url}
          onLoad={() =>
            // boxRef.current?.scrollIntoView({behavior: 'auto'})
            
            setLoadingImgs(prevLoadingImgs => {
              const newLoadingImgs = [...prevLoadingImgs];
              newLoadingImgs[i] = true;
              return newLoadingImgs;
            })
          }
        />
      )}
    </Box>
  )
}

export default ImageMessage