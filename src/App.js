import React, {createContext, useEffect, useState} from "react";
import StartWindow from "./components/start_window/StartWindow";
import {Box} from "@mui/material";
import {makeStyles} from "@mui/styles";
import TableProducts from "./components/TableProducts";
import {HashRouter, Route, Routes} from "react-router-dom";
import Login from "./components/start_window/Login";
import Registration from "./components/start_window/Registration";
import Background from "./assets/store-background.jpg";
import getFirebase from "./firebase";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
      margin: "0 auto",
      backgroundImage: `url(${Background})`,
      backgroundSize: "cover",
      height: "100vh",
      backgroundRepeat: "no-repeat",
      backgroundPositionX: "center",
  },
}));

export const currentUserContext = createContext("");

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState("");
    const classes = useStyles();

    useEffect(() => {
        const firebase = getFirebase();

        if (firebase) {
            firebase.auth().onAuthStateChanged((authUser) => {
                if (authUser) {
                    setCurrentUser(authUser.email);
                } else {
                    setCurrentUser("");
                }
            });
        }

        if (currentUser) {
            const fetch = async () => {
                await firebase
                    .firestore()
                    .collection("users")
                    .doc(`${currentUser}`)
                    .get()
                    .then(snapshot => setUserData(snapshot.data()))
            };

            fetch();
        }
    }, [currentUser]);

  return (
      <currentUserContext.Provider value={{currentUser, setCurrentUser, userData, setUserData}}>
          <Box className={classes.mainContainer}>
              <HashRouter>
                  <Routes>
                      <Route path="/*" element={<StartWindow />}/>
                      <Route path="/login" element={<Login />} />
                      <Route path="/registration" element={<Registration />} />
                      <Route path="/app" element={<TableProducts />} />
                  </Routes>
              </HashRouter>
          </Box>
      </currentUserContext.Provider>
  );
}

export default App;
