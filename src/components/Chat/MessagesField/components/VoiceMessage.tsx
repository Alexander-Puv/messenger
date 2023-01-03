import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { useRef, useState } from 'react';
import { audioData } from '../../../../types/messageTypes';

const VoiceMessage = (audioData: audioData) => {
  const [isListening, setIsListening] = useState(false)
  const [sliderValue, setSliderValue] = useState(0)
  const duration = Number(audioData.audioDuration.replace(':', '.'))
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
    <Box display='flex'>
      <audio ref={audioRef} src={audioData.audioUrl} />
      <Button onClick={!isListening ? playAudio : stopAudio} sx={{minWidth:'auto', p: 0.5}}>
        {!isListening ? <PlayArrowIcon /> : <PauseIcon />}
      </Button>
      <Slider 
        value={sliderValue}
        min={0}
        max={duration * 100}
        onChange={(_, value) => setSliderValue(value as number)}
        size='small'
        sx={{width: 200, m: '0 12px 0 18px'}}
      />
      <Typography>{audioData.audioDuration}</Typography>
    </Box>
  )
}

export default VoiceMessage