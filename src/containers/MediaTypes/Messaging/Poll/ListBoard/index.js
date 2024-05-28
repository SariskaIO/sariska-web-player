import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { convertTimestamptoLocalDateTime, getIntialUpperCaseString } from '../../../../../utils';
import useColor from '../../../../../hooks/useColor';

export default function ListBoard({list}) {
  const color = useColor();

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      backgroundColor: color.secondary,
      '& .MuiListItem-gutters': {
        paddingLeft: 0
      },
      '& .MuiTypography-colorTextSecondary': {
        color: color.whiteLight
      }
    },
  }));
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {
        list.map(item => (
            <ListItem>
                <ListItemAvatar>
                <Avatar style={{background: color.primaryLight}}>
                    {getIntialUpperCaseString(item.name)}
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={convertTimestamptoLocalDateTime(item.updated_at)} />
            </ListItem>
        ))
      }
    </List>
  );
}
