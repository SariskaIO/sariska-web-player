import {room as roomReducer} from './room';
import {user as userReducer} from './user';
import {chat as chatReducer} from './chat';

export const rootReducer = ({
    room,
    user,
    chat
}, action) => {
    return {
        rooms: roomReducer(room, action),
        users: userReducer(user, action),
        chat: chatReducer(chat, action)
    };
}