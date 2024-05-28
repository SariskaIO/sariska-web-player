import { renderAction } from "../../../utils";

export const setUserName = (type, payload)=>renderAction( type, payload );

export const setUser = (type, payload)=>renderAction( type, payload );

export const updateUser = (type, payload)=>renderAction( type, payload );

export const getUserName = (type)=>renderAction( type );

export const getUser = (type)=>renderAction( type );