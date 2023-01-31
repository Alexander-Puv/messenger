import { TextField } from '@mui/material';
import React from 'react'

interface MessageInputProps {
  value: string,
  setValue: (value: string) => void,
  SendMessage: (props?: any) => void
}

const MessageInput = ({value, setValue, SendMessage}: MessageInputProps) => {
  return (
    <TextField
      variant='outlined'
      sx={{flex: 1}}
      size='small'
      maxRows={10}
      multiline
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => {if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        SendMessage();
      }}}
      placeholder='Write a message...'
    />
  )
}

export default MessageInput