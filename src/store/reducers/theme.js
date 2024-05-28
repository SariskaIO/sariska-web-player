import { TOGGLE_THEME } from "../actions/types"

const initialState = {
    theme: JSON.parse(localStorage.getItem('color-theme')) || 'light'
}

export const theme = (state = initialState, action) => {
        switch(action.type){
            case TOGGLE_THEME:
                state.theme = action.payload;
                return {...state};
            default:
                return state;
        }
} 