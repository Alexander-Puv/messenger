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

  const attachFile = async (image: File) => {
    if (!chatContext || !user) return // always false
    const createdAt = Timestamp.now()
    const imageRef = ref(storage, `imageMessages/${chatContext.state.chatId}/${createdAt.nanoseconds + user.uid}`)
    await uploadBytes(imageRef, image).then(() => {

    })
  };

  const onDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files
    attachFile(droppedFiles[0])
  }

  return (
    <div>
      <input
        onChange={e => e.target.files && attachFile(e.target.files[0])}
        type='file' ref={inputRef}
        accept=''
        style={{display: 'none'}}
      />
      <IconButton
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        sx={{color: theme.palette.text.secondary}}
      >
        <ImageIcon />
      </IconButton>
    </div>
  );
}

export default Attach