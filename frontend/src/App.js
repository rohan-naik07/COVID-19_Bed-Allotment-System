import React from "react";
import {ThemeProvider, createMuiTheme, colors, CssBaseline} from "@material-ui/core";
import Navbar from "./components/navigation/Navbar";
import {blue, red} from "@material-ui/core/colors";
import {ThemeContext} from "./context/ThemeContext";
import {WebSocketInstance, socket} from "./WebSocket";
import {MessageContext} from "./context/Message"

const App = () => {
  const {dark} = React.useContext(ThemeContext);
  const {messages,setMessages} = React.useContext(MessageContext);

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

  React.useEffect(()=>{
    WebSocketInstance.connect(1);
    WebSocketInstance.addCallbacks(
      (msgs)=>setMessages(msgs),
      (msgs)=>setMessages(msgs)
    )
    // eslint-disable-next-line
  },[])

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
