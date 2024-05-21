import { Box, List, ListItem, Typography } from '@material-ui/core'
import React from 'react'
import { color } from '../../../../assets/styles/_color'
import { LIVE_STREAMING_DOCS_URL } from '../../../../constants'

const StreamingInfo = () => {
  return (
        <Box sx={{padding: '0 0 0 24px'}}>
            <Box sx={{border: `1px solid ${color.whiteLight}`, borderRadius: '8px', borderBottom: 'none', color: color.whiteLight}}>
                <Box>
                    <Typography variant='h4' style={{fontSize: '1.5rem', borderBottom: `1px solid lightgray`, padding: '16px'}}>
                        Test streams with Sariska Player
                    </Typography>
                </Box>
                <Box>
                    <List>
                        <ListItem>
                            Low Latency HLS play (Apple)
                        </ListItem>
                        <ListItem>
                            Adaptive Bitrate Streaming
                        </ListItem>
                        <ListItem>
                            Customizable Player Controls
                        </ListItem>
                    </List>
                </Box>
            </Box>
            <Box sx={{border: `1px solid ${color.whiteLight}`, borderRadius: '8px', mt: 3, p: 2, textAlign: 'left'}}>
                <Typography style={{lineHeight: 1.7, color: color.whiteLight}}>
                Looking for a live streaming solution?<br /> <span style={{fontWeight: 700, color: color.white}}>SARISKA</span> provides Low Latency (2-3 Sec) Interactive Solutions. <br />Checkout the documentation <a href={LIVE_STREAMING_DOCS_URL} target='_blank' rel="noreferrer" style={{color: color.buttonGradient}}>here</a>
                </Typography>
            </Box>
        </Box>
  )
}

export default StreamingInfo