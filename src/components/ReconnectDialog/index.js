import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import {makeStyles} from "@material-ui/core";
import FancyButton from '../FancyButton';
import useColor from '../../hooks/useColor';

export default function ReconnectDialog({open}) {
    const color = useColor();
    const useStyles = makeStyles((theme) => ({
        dialog: {
            "& .MuiPaper-root": {
                background: color.secondary,
                borderRadius: '7.5px',
                color: color.white,
                boxShadow: `0px 0px 1px 0px rgb(255 255 255 / 20%), 0px 1px 1px 1px rgb(255 255 255 / 14%), 0px 2px 4px 5px rgb(255 255 255 / 12%)`,
                [theme.breakpoints.down("sm")]: {
                    boxShadow: 'none'
                }
            },
            "& p": {
                color: color.white
            },
            [theme.breakpoints.down("sm")]: {
                height: '200px',
                boxShadow: 'none'
            }
        },
        anchor: {
            color: color.secondary,
            textDecoration: "none",
            border: `1px solid ${color.primary}`,
            padding: theme.spacing(1, 5),
            borderRadius: "15px",
            fontWeight: "900",
            textTransform: "capitalize",
            "&:hover": {
                color: color.primary,
            },
        },
    }));
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        window.location.reload();
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                className={classes.dialog}
            >
                <DialogTitle id="responsive-dialog-title">{"Disconnected"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have disconnected, Please reconnect again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <FancyButton onClick={handleClose} autoFocus buttonText={'Reconnect'} top={'0px'} width={'100px'}/>
                </DialogActions>
            </Dialog>
        </div>
    );
}
