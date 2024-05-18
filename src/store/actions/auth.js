import { IS_API_KEY_REQUIRED, SET_API_KEY, SET_IS_MEETING_STARTED } from "./types"

export const setIsApiKeyRequired = (payload) => {
    return {
        type: IS_API_KEY_REQUIRED,
        payload
    }
}

export const setApiKey = (payload) => {
    return {
        type: SET_API_KEY,
        payload
    }
}

export const setIsMeetingStarted = (payload) => {
    return {
        type: SET_IS_MEETING_STARTED,
        payload
    }
}