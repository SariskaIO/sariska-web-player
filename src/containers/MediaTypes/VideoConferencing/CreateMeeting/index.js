import { Box, makeStyles } from '@material-ui/core'
import React from 'react'
import LobbyHome from './LobbyHome';

const CreateMeeting = () => {
    const useStyles = makeStyles(theme => ({
        root: {

        }
    }))
    const classes = useStyles();
  return (
    <Box className={classes.root}>
        <LobbyHome />
    </Box>
  )
}

export default CreateMeeting