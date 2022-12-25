import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { DefaultComponentProps, OverridableTypeMap } from '@mui/material/OverridableComponent'

const Loading = (props: DefaultComponentProps<OverridableTypeMap>) => {
  return (
    <Box {...props} m='auto'>
      <CircularProgress />
    </Box>
  )
}

export default Loading