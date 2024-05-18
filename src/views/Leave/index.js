import { Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { color } from '../../assets/styles/_color';
import {useSelector} from "react-redux";
import FancyButton from '../../components/FancyButton';
import { useNavigate, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: color.secondaryDark,
        "& h3":{
            fontSize: '2rem',
            marginBottom: theme.spacing(4),
            [theme.breakpoints.down("sm")]: {
                fontSize: '1.5rem'
            }
            }
        },
        title: {
            color: color.white,
        },
    }))
const Leave = () => {
    const meetingTitle  = useSelector(state=>state.profile?.meetingTitle);
    const classes = useStyles();
    const navigate = useNavigate();
    const params = useParams();
    
    return (
        <Box className={classes.root}>
            <Typography variant="h3" className={classes.title}>You have left the meeting</Typography>
            <Box>
                <FancyButton 
                    onClick={()=>navigate(`/${params.id}/${meetingTitle}`)}
                    buttonText = 'Rejoin'
                />
                &nbsp; &nbsp;
                <FancyButton 
                    onClick={()=>navigate(`/${params.id}`)}
                    buttonText = 'Go to Home'
                />
            </Box>
        </Box>
    )
}

export default Leave
