import { Box, Grid } from '@material-ui/core'
import React from 'react'
import MessagingRoomSetUp from './MessagingRoomSetUp'
import MessagingRoom from './MessagingRoom'
import { useSelector } from 'react-redux'

const Messaging = () => {
  const isMeetingStarted = useSelector(state => state.auth)?.isMeetingStarted;
  
  return (
        <Box style={{height: 'calc(100vh - 120px)' }}>
          <Grid container style={{height: '100%', justifyContent: 'center', maxWidth: '480px', minWidth: '350px', margin: 'auto'}}>
            {
              !isMeetingStarted ? 
                <Box style={{margin: '16px'}}>
                  <MessagingRoomSetUp />
                </Box> 
                  :
                <Box>
                    <MessagingRoom />
                </Box> 
            }
          </Grid>
        </Box>
  )
}

export default Messaging