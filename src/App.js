import React, {createContext, useState} from "react";
import StartWindow from "./components/start_window/StartWindow";
import {Box} from "@mui/material";
import {makeStyles} from "@mui/styles";
import TableProducts from "./components/TableProducts";
import {HashRouter, Route, Routes} from "react-router-dom";
import Login from "./components/start_window/Login";
import Registration from "./components/start_window/Registration";
import Background from "./assets/store-background.jpg";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
      maxWidth: 1500,
      margin: "0 auto",

      backgroundImage: `url(${Background})`,
      backgroundSize: "cover",
      height: "100vh",
      backgroundRepeat: "no-repeat",
      backgroundPositionX: "center",
  }
}));

export const currentUserContext = createContext("");

function App() {
    const [currentUser, setCurrentUser] = useState("");
  const classes = useStyles();

  return (
      <currentUserContext.Provider value={{currentUser, setCurrentUser}}>
          <Box className={classes.mainContainer}>
              <HashRouter>
                  <Routes>
                      <Route exact path="/start" element={<StartWindow />}/>
                      <Route  path="/login" element={<Login />} />
                      <Route  path="/registration" element={<Registration />} />
                      <Route  path="/app" element={<TableProducts />} />
                  </Routes>
              </HashRouter>
          </Box>
      </currentUserContext.Provider>
  );
}

export default App;
