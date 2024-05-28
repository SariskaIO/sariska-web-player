import { getRandomColor, getUserId } from "../../../utils";
import { GET_USER, GET_USER_NAME, SET_USER, SET_USER_NAME, UPDATE_USER } from "../actions/types";

export const initialState = {
    user: JSON.parse(localStorage.getItem('sariska-chat-user')) || {id: '', name: '', color: ''},
    userName: JSON.parse(localStorage.getItem('sariska-chat-userName')) || ''
}

export const user = (state = initialState, action) => {
    switch(action.type){
        // case SET_USER_NAME:
        //     localStorage.setItem("sariska-chat-user", JSON.stringify(action.payload));
        //     localStorage.setItem("sariska-chat-userName", JSON.stringify(action.payload));
        //     localStorage.setItem("sariska-chat-userId", JSON.stringify(getUserId()));
        //     state.userName = action.payload;
        //     return {...state};
        case UPDATE_USER:
            state.user['name'] = action.payload;
            state.user['id'] = getUserId();
            state.user['color'] = getRandomColor();
            localStorage.setItem("sariska-chat-user", JSON.stringify(state.user));
            return {...state};
        case GET_USER_NAME:
            return state.userName;
        case SET_USER:
            localStorage.setItem("sariska-chat-user", JSON.stringify(action.payload));
            state.user = action.payload;
            return {...state};
        case GET_USER:
            return state.user;
        default:
            return {...state};
    }
}