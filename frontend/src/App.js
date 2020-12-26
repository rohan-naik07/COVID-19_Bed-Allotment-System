import React from "react";
import {ThemeProvider, createMuiTheme, colors, CssBaseline} from "@material-ui/core";
import Navbar from "./components/navigation/Navbar";

const App = () => {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: colors.blue[300],
      },
      secondary: {
        main: colors.red[300],
      },
    },
  })

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Navbar/>
      </ThemeProvider>
  )
}

export default App;
