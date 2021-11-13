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
import {fetchData} from "./components/tableProducts_components/fetchData/fetch";

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

export const dataContext = createContext("");

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState("");
    const classes = useStyles();
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [singleData, setSingleData] = useState({
        id: "",
        product: "",
        category: "",
        quantity: "",
        units: "",
        date: "",
        employee: ""
    });
    const [tableSettingsCard, setTableSettingsCard] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [selected, setSelected] = useState([]);
    const firebase = getFirebase();

    useEffect(() => {
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

            fetchData("categories", setCategories);
            fetchData("units", setUnits);
            fetchData("data", setDataTable);
        }
    }, [firebase, currentUser]);




  return (
      <dataContext.Provider value={{
          categories, setCategories,
          units, setUnits,
          dataTable, setDataTable,
          singleData, setSingleData,
          tableSettingsCard, setTableSettingsCard,
          currentUser, setCurrentUser, userData, setUserData,
          editMode, setEditMode,
          selected, setSelected
      }}
      >
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
      </dataContext.Provider>
  );
}

export default App;
