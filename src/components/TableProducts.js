import React, {useContext} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import getFirebase from "../firebase";
import {dataContext} from "../App";
import {Route, Routes, useNavigate} from "react-router-dom";
import DataTable from "./tableProducts_components/DataTable";
import NewEntry from "./tableProducts_components/NewEntry";
import TableSettings from "./tableProducts_components/TableSettings";
import NewCategory from "./tableProducts_components/NewCategory";
import NewUnit from "./tableProducts_components/NewUnit";


const useStyles = makeStyles((theme) => ({
    mainBox: {
        maxWidth: 1500,
        backgroundColor: theme.palette.primary.contrastText,
        margin: "0 auto",
        height: "100%",
    },
    header: {
        height: 70,
        backgroundColor: theme.palette.secondary.main,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(0, 2),
        color: theme.palette.primary.contrastText
    }
}));


export default function TableProducts () {
    const classes = useStyles();
    const firebase = getFirebase();
    const {setCurrentUser, userData, setDataTable, setUnits, setCategories} = useContext(dataContext);
    const navigate = useNavigate();

    const signOut = async () => {
        try {
            if (firebase) {
                await firebase.auth().signOut();
                setCurrentUser(null);
                setDataTable([]);
                setCategories([]);
                setUnits([]);
                navigate("/start");
            }
        } catch (error) {
            console.log("error", error);
        }
    };


    if (userData) {
        return (
            <Box className={classes.mainBox}>
                <Box className={classes.header}>
                    <Typography variant="h6">Dzień dobry, {userData?.name}!</Typography>
                    <Box style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={signOut}>
                        <Typography style={{marginRight: 16}}>Wyjdź</Typography>
                        <ExitToAppIcon />
                    </Box>
                </Box>
                <DataTable />
                <Routes>
                    <Route path="/app/newEntry" element={<NewEntry />}/>
                    <Route path="/app/edit" element={<NewEntry />}/>
                    <Route path="/app/settings" element={<TableSettings />}/>
                    <Route path="/app/settings/newCategory" element={<NewCategory />}/>
                    <Route path="/app/settings/newUnit" element={<NewUnit />}/>
                </Routes>
            </Box>
        )
    } else {
        return (
            <Box style={{display: "flex", alignItems: "center", justifyContent: "center", height: "90%"}}>
                <CircularProgress color="primary"/>
            </Box>

        );
    }
}