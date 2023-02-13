import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useLayoutEffect, useEffect, useState } from 'react'
import { imgData } from '../../../../types/messageTypes'

const ImageMessage = (imgs: imgData[]) => {
  const defImgStyles: SxProps<Theme> = {
    maxWidth: 'calc(100% - 10px)', m: '5px', pointerEvents: 'none'
  }
  const imgStyles: SxProps<Theme> = ({})
  const [boxWidth, setBoxWidth] = useState(0)
  const images = Object.values(imgs)
  console.log(images);

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
  
  return (
    <Box
      maxWidth={boxWidth}
      display='flex' flexWrap='wrap' justifyContent='center'
      sx={{'img': Object.assign(imgStyles, defImgStyles)}}
    >
      {images.map(img =>
        <img src={img.url} key={img.url} />
      )}
    </Box>
  )
}

export default ImageMessage