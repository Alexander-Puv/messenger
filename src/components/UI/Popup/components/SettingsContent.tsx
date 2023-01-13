import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

const SettingsContent = () => {
  return (
    <List>
      <ListItem>
        <ListItemButton>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary='Settings' />
        </ListItemButton>
      </ListItem>
    </List>
  )
}

export default SettingsContent