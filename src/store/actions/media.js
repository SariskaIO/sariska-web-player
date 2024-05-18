import { SET_CAMERA, SET_MICROPHONE, SET_RESOLUTION, SET_SPEAKER, SET_DEVICES, SET_MEDIA_TYPE } from "./types"

export const setMicrophone = (value) => {
    return {
        type: SET_MICROPHONE,
        payload: value
    }
}

export const setSpeaker = (value) => {
    return {
        type: SET_SPEAKER,
        payload: value
    }
}

export const setDevices = (value) => {
    return {
        type: SET_DEVICES,
        payload: value
    }
}

export const setCamera = (value) => {
    return {
        type: SET_CAMERA,
        payload: value
    }
}


export const setYourResolution = (value) => {
    return {
        type: SET_RESOLUTION,
        payload: value
    }
}


export const setMediaType = (type) => {
    return {
        type: SET_MEDIA_TYPE,
        payload: type
    }
}
