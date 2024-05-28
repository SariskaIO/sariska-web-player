import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
//import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%">
        <LinearProgress variant="determinate" {...props} />
      </Box>
      {/* <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box> */}
    </Box>
  );
}

  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function ProgressBar({max, counter}) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(max);
  React.useEffect(() => {
      setProgress(max === counter ? 100 : (counter/max)*100);
  }, [max, counter]);

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
}
