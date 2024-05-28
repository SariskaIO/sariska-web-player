import React, {useEffect, useState} from 'react'
import {Socket} from 'phoenix';
import SocketContext from './SocketContext';
import {getMessagingToken} from "../../utils";
import { WEB_SOCKET_URL } from '../../config';
import { useStore } from '../context';

const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const {users} = useStore();

    useEffect(() => {
        const fetchData = async ()=> {
            let user = JSON.parse(localStorage.getItem("sariska-chat-user")) || users?.user;
            const token = await getMessagingToken( user?.name, user?.id );
            localStorage.setItem("SARISKA_CHAT_TOKEN", JSON.stringify(token));
            const params = {token};
            const s = new Socket(WEB_SOCKET_URL, {params});
            s.onOpen( () => console.log("connection open!") )
            s.onError( (e) => console.log("there was an error with the connection!", e) )
            s.onClose( () => console.log("the connection dropped") )
            s.connect();
            setSocket(s);
        }
        fetchData();
        return () => {
            socket && socket.disconnect();
        }
    }, [users.user.id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider