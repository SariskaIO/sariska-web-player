import { START_POLL } from "./types"


export const startPoll = (payload) => {
    return {
        type: START_POLL,
        payload
    }
}