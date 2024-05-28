import { VOTED_POLL_OPTION } from "./types"

export const votePoll = (payload) => {
    return {
        type: VOTED_POLL_OPTION,
        payload
    }
}