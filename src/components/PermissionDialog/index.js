import React from 'react';
import Card from '@material-ui/core/Card';
import {Typography, makeStyles} from "@material-ui/core";
import FancyButton from '../FancyButton';
import useColor from '../../hooks/useColor';

export default function PermissionDialog({displayName, allowLobbyAccess, denyLobbyAccess, userId}) {
    const color = useColor();
    const useStyles = makeStyles((theme) => ({
        root: {
            position: "absolute",
            top : 0,
            width: "400px",
            left: 0,
            right: 0,
            margin: "0 auto",
            padding: "50px",
            "& > div" : {
               padding: "20px"
            },
            [theme.breakpoints.down("sm")]: {
                width: '100%',
                padding: "0px",
            }
        },
        card: {
            background: color.secondary,
            border: `1px solid ${color.primaryLight}`,
            color: color.white,
            [theme.breakpoints.down("sm")]: {
                background: color.secondary,
            }
        },
        controls: {
            textAlign: "right",
            marginTop: "20px",
        }
    }));
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <Typography style={{textAlign: 'left'}}>{displayName} wants to join </Typography>
                <div className={classes.controls}>
                    <FancyButton buttonText={'Deny'} onClick={()=>denyLobbyAccess(userId)} width="100px" />
                    &nbsp; &nbsp;
                    <FancyButton buttonText={'Allow'} onClick={()=>allowLobbyAccess(userId)} width="100px"/>
                </div>
            </Card>
        </div>
    );
}
