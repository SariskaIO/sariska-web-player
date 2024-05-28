import { TOGGLE_THEME } from "./types"

export const toggleTheme = (theme) => {
    return {
        type: TOGGLE_THEME,
        payload: theme
    }
}