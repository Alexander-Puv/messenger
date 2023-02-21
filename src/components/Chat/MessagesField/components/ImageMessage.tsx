import { CircularProgress, SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import { imgData } from '../../../../types/messageTypes'
import useTheme from '@mui/material/styles/useTheme';

const ImageMessage = ({imgs}: {imgs: imgData[]}) => {
  const [openImg, setOpenImg] = useState<string | null>(null)
  const theme = useTheme()
  const defImgStyles: SxProps<Theme> = {
    maxWidth: '100%', pointerEvents: 'none'
  }
  const styles = imgs.length === 1 ? {width: 320}
  : imgs.length === 2 ? {width: 430}
  : imgs.length === 3 ? {width: 430}
  : imgs.length === 4 ? {width: 540}
  : {width: 540}

  return (
    <Box
      maxWidth={styles.width}
      display='flex' flexWrap='wrap' justifyContent='center' gap='5px'
      sx={{'img': Object.assign(defImgStyles)}}
    >
      {imgs.map((img, i) => {
        if (i > 4) return <></>

        const [isLoaded, setIsLoaded] = useState(false)
        const newImg = new Image()
        newImg.src = img.url
        newImg.onload = () => {
          setIsLoaded(true)
        }

        const aspectRatio = img.imgProps.width / img.imgProps.height
        const containerWidth = Math.min(styles.width, img.imgProps.width)
        // divide by the number of imgs in a row
        / (imgs.length >= 3 ? // if more than 1 img
            (i < 2 ? 2 // if 1st or 2nd img
            : imgs.length === 3 ? 1 // if 3rd img and 3 imgs total
            : imgs.length === 4 ? 2 // if 3rd or 4th img and 4 imgs total
            : 3) // if neither 1st nor 2nd img and 5 or more imgs total
          : 1) // if 1 img total
        // subtract a gap
        - (imgs.length === 3 && i === 2 ? 0 // if 3rd img and 3 imgs total
        : imgs.length >= 5 && i > 1 ? (5 / 3)  // if neither 1st nor 2nd img and 5 or more imgs total
        : (5 / 2)) // if 1st, 2nd and 2 or more imgs total or 3rd, 4th and 4 imgs total
        const containerHeight = containerWidth / aspectRatio

        const thisImgOpen = openImg === img.url

        return (
          <Box
            width={containerWidth} height={containerHeight}
            display='flex' alignSelf='center'
            onClick={() => isLoaded ? setOpenImg(newImg.src) : {}}
            sx={{cursor: isLoaded ? 'pointer' : 'default'}}
            key={img.url}
          >
            {!isLoaded ?
              <CircularProgress sx={{m: 'auto'}} />
            : <img src={newImg.src}/>
            }
            <Box
              position='fixed'
              top={0} bottom={0}
              left={0} right={0}
              display='flex' p='10%'
              sx={{
                backgroundColor: 'rgb(0 0 0 / 50%)',
                transform: `translateX(${thisImgOpen ? 0 : '100%'})`,
                transition: `${theme.transitions.duration.shortest}ms ease-out`,
                zIndex: 1000,
              }}
            >
              {thisImgOpen && <>
                <Box
                  maxWidth='80%' maxHeight='80%'
                  display='flex' flex={1}
                  sx={{
                    backgroundImage: `url(${openImg}) no-repeat center`,
                    backgroundSize: 'contain'
                  }}
                />
                <Box
                  position='absolute'
                  top={0} bottom={0}
                  left={0} right={0}
                  sx={{backgroundColor: 'rgb(0 0 0 / 50%)', zIndex: -1}}
                  onMouseUp={(e) => e.button === 0 && setOpenImg(null)}
                />
              </>}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default ImageMessage