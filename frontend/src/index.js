import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {SnackbarProvider} from 'notistack';
import {BrowserRouter} from "react-router-dom";
import {ThemeContextProvider} from "./context/ThemeContext";

ReactDOM.render(
     <ThemeContextProvider>
      <SnackbarProvider maxSnack={1}>
          <BrowserRouter>
              <App/>
          </BrowserRouter>
      </SnackbarProvider>
    </ThemeContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
