import React from 'react'
import VideoConferencing from './VideoConferencing'
import { useSelector } from 'react-redux'
import { LIVE_STREAMING, MESSAGING, VIDEO_CONFERENCING } from '../../constants';
import LiveStreaming from './LiveStreaming';
import Messaging from './Messaging';

const MediaTypes = () => {
  const mediaType = useSelector(state => state.media)?.mediaType;

  const getMediaTypeElement = () => {
    if(mediaType === VIDEO_CONFERENCING) return <VideoConferencing />
    if(mediaType === LIVE_STREAMING) return <LiveStreaming />
    if(mediaType === MESSAGING) return <Messaging />
  }
  
  return (
    <div>
      {getMediaTypeElement()}
    </div>
  )
}

export default MediaTypes