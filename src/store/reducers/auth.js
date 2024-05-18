import { IS_API_KEY_REQUIRED, SET_API_KEY, SET_IS_MEETING_STARTED} from "../actions/types";
const initialState = {
    isApiKey: true,
    apiKey: null,
    isMeetingStarted: false
};

export const auth = (state = initialState, action) => {
    switch (action.type) {
        case IS_API_KEY_REQUIRED:
            state.isApiKey = action.payload;
            return {...state};
        case SET_API_KEY:
            state.apiKey = action.payload;
            return {...state};
        case SET_IS_MEETING_STARTED:
            state.isMeetingStarted = action.payload;
            return {...state};
        default:
            return state;
    }
}
