
import React, {useEffect, useState} from 'react'
import { useDispatch } from "react-redux";
import { showNotification } from "../../store/actions/notification";
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const SnackbarBox = ({notification}) => {
    const  [open, setOpen] = useState({open: false});
    const dispatch = useDispatch();

    useEffect(()=>{
        setOpen(true);
        if (!notification?.autoHide) {
            return;
        }
        setTimeout(()=>{
            setOpen(false);
            dispatch(showNotification({
            message: "",
            severity: "warning",
            autoHide: true
        }))
        }, 2000);
    }, [notification?.message]);

    if (!notification?.message) {
        return null;
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            autoHideDuration={2000}
            open={open}
        >
            <Alert elevation={6} variant='filled' classes={{maxWidth: "auto"}} severity={notification.severity}>{notification.message}</Alert>
        </Snackbar>
    )
}

export default SnackbarBox;
