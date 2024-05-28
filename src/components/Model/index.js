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
import InitiatePoll from '../../containers/MediaTypes/Messaging/Poll/InitiatePoll';
import useColor from '../../hooks/useColor';
import { useSelector } from 'react-redux';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: '366px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  const color = useColor();
  const theme = useSelector(state => state.theme)?.theme;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other} style={{background: theme ==='dark' ? color.secondaryDark : color.secondary}}>
      <Typography variant="h6" style={{fontWeight: 900, color: color.white}}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon style={{fontWeight: 900, color: color.white}} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  },
}))(MuiDialogActions);

export default function Model({open, poll, setPoll, handleChange, handleClose, handleSubmit}) {
  const color = useColor();
  const theme = useSelector(state => state.theme)?.theme;
  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose} >
          Create Poll
        </DialogTitle>
        <DialogContent dividers style={{background: theme ==='dark' ? color.secondary : color.secondaryDark }}>
        <InitiatePoll
          poll={poll}
          setPoll={setPoll}
          handleChange={handleChange}
        />
        </DialogContent>
        <DialogActions style={{justifyContent: 'space-between', padding: '8px 16px 8px 24px', background: theme ==='dark' ? color.secondaryDark : color.secondary}}>
          <Typography style={{color: "red"}} >{poll.error}</Typography>
          <Button autoFocus onClick={handleSubmit} color="primary" variant='contained' style={{textTransform: 'initial'}}>
            Poll Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
