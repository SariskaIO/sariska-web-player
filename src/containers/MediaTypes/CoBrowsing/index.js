import React from 'react'

const CoBrowsing = () => {
  return (
    <div style={{height: 'calc(100vh - 124px)', marginTop: '16px'}}>
        <iframe 
              allow="camera; microphone; fullscreen; 
              speaker; display-capture"
              src={'https://cobrowse.sariska.io/'}
              width={'100%'}
              height={'100%'}
              title='co-browsing'
              style={{border: 'none'}}
            ></iframe>
    </div>
  )
}

export default CoBrowsing