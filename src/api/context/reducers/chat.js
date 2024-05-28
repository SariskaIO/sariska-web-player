import { SET_IS_CHAT_STARTED } from "../actions/types";

export const initialState = {
    isChatStarted: false
}

export const chat = (state = initialState, action) => {
    switch(action.type){
        case SET_IS_CHAT_STARTED:
            state.isChatStarted = action.payload;
            return {...state};
        default:
            return {...state};
    }
}