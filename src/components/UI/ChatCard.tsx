import { Avatar, Card, CardHeader } from '@mui/material'
import React from 'react'

interface ChatCardProps {
  img: string,
  title: string,
  content: string,
  onClick?: (props?: any) => void
}

const ChatCard = (props: ChatCardProps) => {
  return (
    <Card
      sx={{
        mt: 1, mr: '9px' /* 15px (standard margin) - 6px (scrollbar) */,
        p: 2, display: 'flex',
        '&:first-of-type': {mt: 0},
        cursor: 'pointer'
      }}
      onClick={props.onClick}
    >
      <CardHeader sx={{p: 0}}
        avatar={
          <Avatar src={props.img} alt={props.title} />
        }
        title={props.title}
        subheader={props.content}
      />
    </Card>
  )
}

export default ChatCard