import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { audioData } from '../../../../types/messageTypes';

interface VoiceMessageProps {
  audioData: audioData,
  isLoading?: boolean
}

const VoiceMessage = ({audioData, isLoading}: VoiceMessageProps) => {
  const [isListening, setIsListening] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [sliderValue, setSliderValue] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsListening(true);
        audioRef.current && audioRef.current.addEventListener("ended", () => {
          setIsListening(false);
        });
      }).catch(() => {
        setIsListening(false);
      });
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      setIsListening(false)
      audioRef.current.pause();
    }
  }
  
  return (
    <Box display='flex' alignItems='center'>
      {isLoading ? // if message is loading, shows loader
        <CircularProgress sx={{width: '32px !important', height: '32px !important', p: 0.5}} />
      : // otherwise shows loaded message
        <>
        <audio
          ref={audioRef} src={audioData.audioUrl}
          onTimeUpdate={e => setSliderValue(e.target.currentTime)}
        />
        <Button onClick={!isListening ? playAudio : stopAudio} sx={{minWidth:'auto', p: 0.5}}>
          {!isListening ? <PlayArrowIcon /> : <PauseIcon />}
        </Button>
        </>
      }
      <Slider
        value={sliderValue}
        min={0} max={audioData.audioDuration.number}
        onChange={(_, value) => {setSliderValue((value as number) / 100); console.log(value);}}
        size='small'
        sx={{width: 200, m: '0 12px 0 18px'}}
      />
      <Typography>{audioData.audioDuration.string}</Typography>
    </Box>
  )
}

export default VoiceMessage