import { createContext, useContext, useReducer } from "react"
import { rootReducer } from "./reducers";
import initialContextState from "./intialState";

export const StoreContext = createContext();

export const StoreProvider = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer, initialContextState);
    
    const {users, rooms, chat} = state;
    return (
        <StoreContext.Provider value={{users, rooms, chat, dispatch}}>
            {children}
        </StoreContext.Provider>    
    );
}

export const useStore = () => useContext(StoreContext);