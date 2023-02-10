import ImageIcon from '@mui/icons-material/Image';
import IconButton from '@mui/material/IconButton';
import useTheme from '@mui/material/styles/useTheme';
import { useContext, useRef } from 'react';
import { ChatContext } from '../../reducer/ChatContext';

interface AttachFileProps {
  acceptFiles: string,
  Icon: typeof ImageIcon
}

const AttachFile = ({acceptFiles, Icon}: AttachFileProps) => {
  const chatContext = useContext(ChatContext)
  const theme = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div>
      <input
        onChange={e => e.target.files
          && chatContext?.setImages(chatContext.images
            ? [...chatContext.images, ...e.target.files]
            : [...e.target.files])}
        type='file' ref={inputRef}
        accept={acceptFiles}
        multiple
        style={{display: 'none'}}
      />
      <IconButton
        onClick={() => inputRef.current?.click()}
        sx={{color: theme.palette.text.secondary}}
      >
        <Icon />
      </IconButton>
    </div>
  );
}

export default AttachFile