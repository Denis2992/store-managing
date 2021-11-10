import React, {useContext} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import getFirebase from "../firebase";
import {currentUserContext} from "../App";
import {useNavigate} from "react-router-dom";
import DataTable from "./tableProducts_components/DataTable";

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
    const {setCurrentUser, userData} = useContext(currentUserContext);
    const navigate = useNavigate();



    const signOut = async () => {
        try {
            if (firebase) {
                await firebase.auth().signOut();
                setCurrentUser(null);
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
            </Box>
        );
    } else {
        return (
            <CircularProgress color="secondary"/>
        );
    }
}