import { Box, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/actions/profile';
import video from '../../assets/images/Video.svg';
import streaming from '../../assets/images/Streaming.svg';
import messaging from '../../assets/images/Messaging.svg';
import cobrowsing from '../../assets/images/Cobrowsing.svg';

import { setApiKey } from '../../store/actions/auth';
import { LIVE_STREAMING, MESSAGING, VIDEO_CONFERENCING, CO_BROWSING } from '../../constants';
import MediaSetUp from '../../containers/MediaSetUp';
import MediaTypes from '../../containers/MediaTypes';



const Home = () => {
    const [isApiKey, setIsApiKey] = useState(true);
    const [apiKeyValue, setApiKeyValue] = useState('');
    const [next, setNext] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const mediaType = useSelector(state => state.media)?.mediaType;

    const useStyles = makeStyles((theme)=>({
        root: {
            padding: ' 16px 32px', 
            textAlign: 'center',
            [theme.breakpoints.down('md')]: {
                padding: '16px'
            }
        }
    }))


    const classes = useStyles();

    const handleChange = (e) => {
        setApiKeyValue(e.target.value);
        dispatch(updateProfile({key: "apiKey", value: e.target.value}));
        dispatch(setApiKey(e.target.value))
        setNext(false);
        setError(null);
    }
    
  return (
        <Box className={classes.root}>
            <Header />
            {
                !mediaType ? (
                    <MediaSetUp 
                        isApiKey={isApiKey} 
                        apiKeyValue={apiKeyValue} 
                        handleChange={handleChange} 
                        next={next} 
                        setNext={setNext} 
                        setIsApiKey={setIsApiKey} 
                        error={error} 
                        setError={setError} 
                        list={list}
                    />)
                :
                <MediaTypes 
                
                />
            }
        </Box>
  )
}

export default Home

const list = [
    {
        id: 1,
        alt: 'Video Conferencing',
        title: <>Video<br />Conferencing</>,
        to: '/video-conferencing',
        src: video,
        mediaType: VIDEO_CONFERENCING
    },
    {
        id: 2,
        alt: 'Live Streaming',
        title: <>Live<br />Streaming</>,
        to: '/live-streaming',
        src: streaming,
        mediaType: LIVE_STREAMING,
        ml: window.innerWidth > 960 ? '32px' : 0,
        mr: window.innerWidth > 960 ? '32px' : 0,
    },
    {
        id: 3,
        alt: 'Real Time Messaging',
        title: <>Real Time<br />Messaging</>,
        to: '/messaging',
        src: messaging,
        mediaType: MESSAGING
    },
    {
        id: 4,
        alt: 'Co Browsing',
        ml: '32px',
        title: <>Co Browsing</>,
        to: '/co-browsing',
        src: cobrowsing,
        mediaType: CO_BROWSING
    }
]