// import React from 'react';
 import { makeStyles } from '@material-ui/core/styles';
 import { color } from '../../assets/styles/_color';

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import CheckboxList from '../CheckboxList';

const useStyles = makeStyles({
  root: {
    '& .MuiDialog-paper': {
        background: color.secondary,
        width: '420px',
        padding: '32px'
    },
    '& .MuiFormControlLabel-root:hover': {
        opacity: '0.8',
        color: color.blurEffect
    },
    '& .MuiRadio-colorSecondary.Mui-checked': {
        color: color.blueHeading
    }
  },
  goLive: {
    borderColor: color.primaryLight,
    color: color.primaryLight,
    textTransform: 'capitalize',
    borderRadius: '30px',
    marginTop: '24px',
    '&:hover': {
        background: color.red,
        borderColor: color.red,
        color: color.white
    }
  }
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
        fontWeight: 600,
        color: color.primaryLight,
        textAlign: 'start'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: color.secondary,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes.title}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    textAlign: 'start'
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function DialogBox({open, handleClose, value, handleChange, startStreaming}) {
const classes  = useStyles();
const goLive = async() => {
    await startStreaming()
    handleClose();
}
  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth='sm' className={classes.root}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Select Live Streaming Option
        </DialogTitle>
        <DialogContent dividers>
          <CheckboxList value={value} handleChange={handleChange} />
            {/* <RadioBox value={value} handleChange={handleChange} /> */}
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' autoFocus onClick={goLive} className={classes.goLive}>
            Go Live
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

