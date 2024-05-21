import {
  SET_CAMERA,
  SET_MICROPHONE,
  SET_RESOLUTION,
  SET_SPEAKER,
  SET_DEVICES,
  SET_MEDIA_TYPE,
  SET_STREAMING_URLS,
  SET_STREAMING_TYPES
} from "../actions/types";

const initialState = {
  microphone: "",
  speaker: "",
  camera: "",
  devices: null,
  resolution: 720,
  aspectRatio: 16/9,
  mediaType: "",
  streamingTypes: ['normal_latency'],
  streamingUrls: {}
};

export const media = (state = initialState, action) => {
  switch (action.type) {
    case SET_MICROPHONE:
      state.microphone = action.payload;
      return {
        ...state,
      };
    case SET_SPEAKER:
      state.speaker = action.payload;
      return {
        ...state,
      };
    case SET_CAMERA:
      state.camera = action.payload;
      return {
        ...state,
      };
    case SET_DEVICES:
      state.devices = action.payload;
      return {
        ...state,
      };    
    case SET_RESOLUTION:
      state.resolution = action.payload.resolution;
      state.aspectRatio = action.payload.aspectRatio;
      return {
        ...state,
      };
    case SET_MEDIA_TYPE:
      state.mediaType = action.payload;
      return {
        ...state
      }
    case SET_STREAMING_TYPES:
      state.streamingTypes = [...action.payload];
      return {
        ...state
      }
    case SET_STREAMING_URLS:
      state.streamingUrls = {...action.payload};
      return {
        ...state
      }
    default:
      return state;
  }
};
