/* eslint-disable */
import React from "react";
import {ThemeProvider, createMuiTheme, CssBaseline} from "@material-ui/core";
import Navbar from "./components/navigation/Navbar";
import {blue, red} from "@material-ui/core/colors";
import {ThemeContext} from "./context/ThemeContext";

const App = () => {
  const {dark} = React.useContext(ThemeContext);

  const theme = createMuiTheme({
    palette: {
      type: dark ? 'dark' : 'light',
      primary: {
        main: dark?blue[300]:blue[800],
      },
      secondary: {
        main: dark?red[300]:red[800],
      },
    },
  })

  return (
     <>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Navbar/>
      </ThemeProvider>
      </>
  )
}

export default App;
