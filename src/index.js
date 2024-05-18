import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, createTheme } from '@material-ui/core';

let theme = createTheme({
    typography: {
        "fontFamily": `'DM Sans', sans-serif`,
    }
});

ReactDOM.render(
<ThemeProvider theme={theme}>
    <Provider store={store}>
            <App />
    </Provider>
</ThemeProvider>
, document.getElementById('root')
);
