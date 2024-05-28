import React from 'react'
import VideoConferencing from './VideoConferencing'
import { useSelector } from 'react-redux'
import { CO_BROWSING, LIVE_STREAMING, MESSAGING, VIDEO_CONFERENCING } from '../../constants';
import LiveStreaming from './LiveStreaming';
import Messaging from './Messaging';
import { StoreProvider } from '../../api/context';
import SocketProvider from '../../api/socket/SocketProvider';
import CoBrowsing from './CoBrowsing';

const MediaTypes = () => {
  const mediaType = useSelector(state => state.media)?.mediaType;
  
  const getMediaTypeElement = () => {
    if(mediaType === VIDEO_CONFERENCING) return <VideoConferencing />
   if(mediaType === LIVE_STREAMING) return <LiveStreaming />
    if(mediaType === MESSAGING) return (
      <StoreProvider>
        <SocketProvider>
          <Messaging />
        </SocketProvider>
      </StoreProvider>
   )
   if(mediaType === CO_BROWSING) return <CoBrowsing />
        
  }
  
  return (
    <div>
      {getMediaTypeElement()}
    </div>
  )
}

export default MediaTypes