import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { color } from '../../assets/styles/_color';
import { STREAMING_TYPES } from '../../constants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    '& .MuiListItem-root': {
      color: color.white
    },
    '& .MuiCheckbox-root': {
      color: color.white
    }
  },
})); 

export default function CheckboxList({value, handleChange}) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {STREAMING_TYPES.map((item) => {
        const labelId = `checkbox-list-label-${item.value}`;

        return (
          <ListItem key={item.value} role={undefined} dense button onClick={() => handleChange(item.value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={value.indexOf(item.value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={item.label} />
          </ListItem>
        );
      })}
    </List>
  );
}
