import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core';
import useColor from '../../hooks/useColor';

export default function DrawerBoard({toggleDrawer, open, content}) {
  const color = useColor();

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiPaper-root': {
      background: color.secondary
    }
  }
}))
  const classes = useStyles();
  return (
    <div>
          <SwipeableDrawer
            anchor={'right'}
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
            className={classes.root}
          >
            {content('right')}
          </SwipeableDrawer>
    </div>
  );
}
