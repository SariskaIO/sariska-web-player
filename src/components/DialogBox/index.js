// import React from 'react';
 import { makeStyles } from '@material-ui/core/styles';

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
import useColor from '../../hooks/useColor';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
        fontWeight: 600,
        textAlign: 'start'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  const color = useColor();
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes.title} style={{color: color.primaryLight}}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose} style={{color: color.secondary}}>
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
    justifyContent: 'center'
  },
}))(MuiDialogActions);

export default function DialogBox({open, handleClose, value, handleChange, startStreaming}) {
  const color = useColor();

const useStyles = makeStyles({
  root: {
    '& .MuiDialog-paper': {
        background: color.secondary,
        width: '420px',
        padding: '0px 32px 16px 32px',
        borderRadius: '8px'
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
    marginTop: '16px',
    fontSize: '1.2rem',
    padding: '2px 28px',
    '&:hover': {
        background: color.red,
        borderColor: color.red,
        color: color.white
    }
  }
});
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

