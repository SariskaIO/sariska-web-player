import { GET_ROOM, GET_ROOM_NAME, SET_ROOM, SET_ROOM_NAME } from "../actions/types";

export const initialState = {
    room: JSON.parse(localStorage.getItem('sariska-chat-room')) || {},
    roomName: JSON.parse(localStorage.getItem('sariska-chat-roomName')) || ''
}

export const room = (state = initialState, action) => {
    switch(action.type){
        case SET_ROOM_NAME:
            localStorage.setItem("sariska-chat-roomName", JSON.stringify(action.payload));
            state.roomName = action.payload;
            return {...state};
        case GET_ROOM_NAME:
            return {...state.roomName};
        case SET_ROOM:
            localStorage.setItem("sariska-chat-room", JSON.stringify(action.payload));
            state.room = action.payload;
            return {...state};
        case GET_ROOM:
            return {...state.room};
        default:
            return {...state};
    }
}