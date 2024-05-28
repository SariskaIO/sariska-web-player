
import { initialState as initialStateRoom } from "../reducers/room";
import { initialState as initialStateUser } from "../reducers/user";
import { initialState as initialStateChat } from "../reducers/chat";

const initialContextState = {
    rooms: initialStateRoom,
    users: initialStateUser,
    chat: initialStateChat
}

export default initialContextState;