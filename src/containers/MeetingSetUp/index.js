import { Box } from '@material-ui/core'
import React from 'react'
import CreateMeeting from './CreateMeeting';
import Meeting from './Meeting';
import { useSelector } from 'react-redux';

const MeetingSetUp = () => {
    const isMeetingStarted = useSelector(state => state.auth)?.isMeetingStarted;

  return (
    <Box>
            {isMeetingStarted ? <Meeting /> : <CreateMeeting />}
    </Box>
  )
}

export default MeetingSetUp