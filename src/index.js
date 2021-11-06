import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import 'reset-css';

export const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#ff3d00',
        },
        info: {
            main: '#673ab7',
        },
    },
    shape: {
        borderRadius: 10,
    },
});


ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
          <App />
      </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
