import { Accordion, AccordionDetails, AccordionSummary, Button, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Box from '@mui/material/Box/Box';
import { greenColor, redColor } from '../../utils/colors';

interface Item {
  title: string,
  primary: string,
  textField: JSX.Element,
  icon: JSX.Element
}

interface ListInputItem {
  item: Item,
  cancel: () => void,
  apply: () => void
}

const ListInputItem = ({item, cancel, apply}: ListInputItem) => {
  return (
    <ListItem key={item.title}>
      <Accordion sx={{width: '100%', backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none'}}>
        <AccordionSummary sx={{'.MuiAccordionSummary-content': {m: '0 !important'}}}>
          <ListItemButton title={item.title}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.primary}
              sx={{textAlign: 'end'}}
            />
          </ListItemButton>
        </AccordionSummary>
        <AccordionDetails sx={{display: 'flex', flexDirection: 'column'}}>
          {item.textField}
          {item.textField.props.value &&
            <Box mt={1} display='flex' justifyContent='flex-end' gap={1}>
              <Button sx={{color: redColor}} onClick={cancel}>Cancel</Button>
              <Button sx={{color: greenColor}} onClick={apply}>Apply</Button>
            </Box>
          }
        </AccordionDetails>
      </Accordion>
    </ListItem>
  )
}

export default ListInputItem