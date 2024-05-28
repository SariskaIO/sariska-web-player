import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getObjectKeysLength } from '../../../../utils';
import { Box, Typography, makeStyles } from '@material-ui/core';
import CopyMeetingLink from '../../../../components/CopyMeetingLink';
import useColor from '../../../../hooks/useColor';

const StreamingUrls = () => {
    const streamingUrls = useSelector(state => state.media)?.streamingUrls;
    const [specificStreamingUrls, setSpecificStreamingUrls] = useState({});
    let filteredStreamingUrls = {};
    const color = useColor();
    const useStyles = makeStyles(() => ({
        urlBox: {
            border: `1px solid ${color.whitePointOne}`, 
            borderRadius: '8px', 
            padding: '8px 8px 8px 24px', 
            wordBreak: 'break-word', 
            minHeight: '208px', 
            textAlign: 'left', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-around'
        }
    }));
    const classes = useStyles();

    const getStreamingUrlsKeysValues = (url) => {
        for (const [key, value] of Object.entries(url)){
            if(key === 'low_latency_hls_url'){
                filteredStreamingUrls['Low Latency HLS URL'] = value;
            }
            if(key === 'low_latency_hls_master_url'){
                filteredStreamingUrls['Low Latency HLS Master URL'] = value;
            }
            if(key === 'rtmp_url'){
                filteredStreamingUrls['RTMP URL'] = value;
            }
            if(key === 'hls_url'){
                filteredStreamingUrls['HLS URL'] = value;
            }
            if(key === 'hls_master_url'){
                filteredStreamingUrls['HLS Master URL'] = value;
            }
            if(key === 'vod_url'){
                filteredStreamingUrls['VoD URL'] = value;
            }
        }
        setSpecificStreamingUrls(filteredStreamingUrls);
    }

  useEffect(() => {
    getStreamingUrlsKeysValues(streamingUrls)
  },[Object.keys(streamingUrls)?.length])
    
  return (
    <div>
        {
                getObjectKeysLength(specificStreamingUrls) ? 
                    <Box sx={{padding: '24px 12px', width: '90vw', maxWidth: '1400px', margin: 'auto'}}>
                        <Box className={classes.urlBox}>
                    <Box>
                        <Typography variant='h5'>Streaming Links</Typography>
                    </Box>
                        {Object.entries(specificStreamingUrls).map(([key, value]) => (
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Box>
                                <Typography variant='h6' style={{color: color.primaryLight}}>
                                    {key}
                                </Typography>
                                <Typography style={{color: color.white}}>
                                    {value}
                                </Typography>
                                </Box>
                                <CopyMeetingLink textToCopy={value} color={color.white} />
                            </Box>
                        ))}    
                        </Box> 
                    </Box>  
                : null 
            }     
    </div>
  )
}

export default StreamingUrls