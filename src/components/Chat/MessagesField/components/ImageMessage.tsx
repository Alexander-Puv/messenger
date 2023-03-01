import { CircularProgress, IconButton, SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import { imgData } from '../../../../types/messageTypes'
import useTheme from '@mui/material/styles/useTheme';
import CloseIcon from '@mui/icons-material/Close';
import { backgroundImage } from '../../../../utils/colors';

const ImageMessage = ({imgs}: {imgs: imgData[]}) => {
  const [openImg, setOpenImg] = useState<string | null>(null)
  const theme = useTheme()
  const styles = imgs.length === 1 ? {width: 320}
  : imgs.length === 2 ? {width: 430}
  : imgs.length === 3 ? {width: 430}
  : imgs.length === 4 ? {width: 540}
  : {width: 540}

  return (
    <Box
      maxWidth={styles.width}
      display='flex' flexWrap='wrap' justifyContent='center' gap='5px'
      sx={{'img': {maxWidth: '100%', pointerEvents: 'none'}}}
    >
      {imgs.map((img, i) => {
        if (i > 4) return <React.Fragment key={img.url}></React.Fragment>
        
        const [isLoaded, setIsLoaded] = useState(false)
        const newImg = new Image()
        newImg.src = img.url
        newImg.onload = () => {
          setIsLoaded(true)
        }

        const aspectRatio = img.imgProps.width / img.imgProps.height
        const containerWidth = Math.min(styles.width, img.imgProps.width)
        // divide by the number of imgs in a row
        / (imgs.length >= 2 ? // if more than 1 img
            (i < 2 ? 2 // if 1st or 2nd img
            : imgs.length === 3 ? 1 // if 3rd img and 3 imgs total
            : imgs.length === 4 ? 2 // if 3rd or 4th img and 4 imgs total
            : 3) // if neither 1st nor 2nd img and 5 or more imgs total
          : 1) // if 1 img total
        // subtract a gap
        - ((imgs.length === 3 && i === 2) || (imgs.length === 1) ? 0 // if 3rd img and 3 imgs total or just 1 img total
        : imgs.length >= 5 && i > 1 ? (10 / 3)  // if neither 1st nor 2nd img and 5 or more imgs total
        : (5 / 2)) // if 1st, 2nd and 2 or more imgs total or 3rd, 4th and 4 imgs total
        const containerHeight = containerWidth / aspectRatio

        return (
          <Box
            position='relative'
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
            {imgs[4] === img &&
              <Box
                position='absolute'
                top={0} bottom={0}
                left={0} right={0}
                display='flex'
                alignItems='center'
                justifyContent='center'
                sx={{backgroundColor: 'rgb(0 0 0 / 50%)'}}
              >
                {'+' + (imgs.length - 4)}
              </Box>
            }
          </Box>
        )
      })}
      <Box
        position='fixed'
        top={0} bottom={0}
        left={0} right={0}
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={{
          backgroundColor: 'rgb(0 0 0 / 50%)',
          transform: `translateX(${openImg ? 0 : '100%'})`,
          transition: `${theme.transitions.duration.shortest}ms ease-out`,
          zIndex: 1000,
        }}
      >
        {openImg && <>
          <Box
            position='fixed' p={2}
            height='100%' width='100%'
            display='flex' flexDirection='column'
            justifyContent='space-between'
            sx={{backgroundColor: 'rgb(0 0 0 / 50%)'}}
          >
            <Box
              display='flex' flex={1} mb={2.5}
              sx={{
                background: `url(${openImg}) no-repeat center`,
                backgroundSize: 'contain'
              }}
            />
            <Box display='flex' sx={{overflowX: 'auto'}}>
              <Box display='flex' m='0 auto' gap='5px'>
                {imgs.map(img =>
                  <Box
                    width={85} height={85}
                    display='flex' position='relative' p='5px'
                    border={`1px solid ${openImg === img.url ? theme.palette.primary.dark : 'transparent'}`}
                    sx={{
                      cursor: 'pointer',
                      'img': {maxWidth: '100%', maxHeight: '100%', m: 'auto'},
                      '&:hover svg': {opacity: 1}
                    }}
                    onClick={() => setOpenImg(img.url)}
                    key={img.url}
                  >
                    <img src={img.url} />
                  </Box>
                )}
              </Box>
            </Box>
            <IconButton
              sx={{position: 'absolute', top: 15, right: 25}}
              onClick={() => setOpenImg(null)}
            >
              <CloseIcon sx={{width: 30, height: 30}} />
            </IconButton>
          </Box>
        </>}
      </Box>
    </Box>
  )
}

export default ImageMessage