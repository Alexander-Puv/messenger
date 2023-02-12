import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useLayoutEffect, useEffect, useState } from 'react'
import { imgsData } from '../../../../types/messageTypes'

const ImageMessage = (imgs: imgsData) => {
  const defImgStyles: SxProps<Theme> = {maxWidth: 'calc(100% - 10px)', m: '5px', pointerEvents: 'none'}
  const imgStyles: SxProps<Theme> = ({})
  const [boxWidth, setBoxWidth] = useState(0)

  useLayoutEffect(() => {
    switch (imgs.urls?.length) {
      case 1:
        setBoxWidth(320)
        Object.assign(imgStyles, {p: 0})
        break;
      case 2:
        setBoxWidth(320)
        Object.assign(imgStyles, {p: 0})
        break;
      default:
        break;
    }
  }, [])
  
  return (
    <Box
      maxWidth={boxWidth}
      display='flex' flexWrap='wrap' justifyContent='center'
      sx={{'img': Object.assign(imgStyles, defImgStyles)}}
    >
      {imgs.urls?.map(url =>
        <img src={url} key={url} />
      )}
    </Box>
  )
}

export default ImageMessage