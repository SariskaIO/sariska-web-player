import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {color} from '../../assets/styles/_color';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../../store/actions/notification';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import StyledTooltip from '../StyledTooltip';



const CopyMeetingLink = ({textToCopy, color}) => {
    const useStyles = makeStyles((theme) => ({
          icon: {
            fontSize: "1.6rem !important",
            padding: "12px !important",
            marginRight: "12px",
            fill : color ? color : 'currentColor',
            [theme.breakpoints.down("md")]: {
            marginRight: "6px !important",
            },
          }
    }));
    const classes = useStyles();
    const [copySuccess, setCopySuccess] = useState('');
    const dispatch = useDispatch();

    function copyToClipboard() {
        navigator.clipboard.writeText(textToCopy);
        setCopySuccess('successfully copied');
        dispatch(showNotification({
            message: "successfully copied",
            severity: "info",
            autoHide: true
        }))
    }

    return (

        <StyledTooltip title={"Click to Copy Meeting Title"}>
            <FileCopyOutlinedIcon className={classes.icon} onClick={copyToClipboard}/>
        </StyledTooltip>
    )
}

export default CopyMeetingLink

