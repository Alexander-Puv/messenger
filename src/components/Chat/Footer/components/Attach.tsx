import ImageIcon from '@mui/icons-material/Image';
import IconButton from '@mui/material/IconButton';
import useTheme from '@mui/material/styles/useTheme';
import { Timestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useContext, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from '../../../../MainConf';
import { ChatContext } from '../../../../reducer/ChatContext';

const Attach = () => {
  const {auth, storage} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const chatContext = useContext(ChatContext)
  const theme = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)

  

  return (
    <div>
      <input
        onChange={e => e.target.files && chatContext?.setImages(e.target.files)}
        type='file' ref={inputRef}
        accept='.jpg, .webp, .jpeg, .png'
        multiple
        style={{display: 'none'}}
      />
      <IconButton
        onClick={() => inputRef.current?.click()}
        sx={{color: theme.palette.text.secondary}}
      >
        <ImageIcon />
      </IconButton>
    </div>
  );
}

export default Attach