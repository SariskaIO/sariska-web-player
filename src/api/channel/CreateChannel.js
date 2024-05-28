import { useContext, useEffect, useRef, useState } from 'react'
import SocketContext from '../socket/SocketContext'

const CreateChannel = (topic, params={}) => {
    const socket = useContext(SocketContext);
    const [channel, setChannel] = useState(null);
    useEffect(()=>{
        if(socket===null){
            return;
        }
        const ch = socket.channel(topic, params);
        ch.join()
            .receive('ignore', () => console.log('Access denied.'))
            .receive('ok', () => console.log('Access granted.'))
            .receive('timeout', () => console.log('Timeout.'));
        setChannel(ch);
        return () => {
            ch && ch.leave();
        }
    }, [socket])
    return (
        channel
    )
}

export default CreateChannel;
