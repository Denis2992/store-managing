import React, {useContext} from "react";
import {Box, Button, Paper, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useStyles from "./styles";
import {currentUserContext} from "../../App";
import TableProducts from "../TableProducts";


export default function StartWindow () {
    const classes = useStyles();
    const navigate = useNavigate();
    const {currentUser} = useContext(currentUserContext);


        if (!currentUser) {
            return (
                <Box className={classes.mainContainer}>
                    <Paper className={classes.welcomeWindow} elevation={20}>
                        <Typography variant="h5">Dzień dobry!</Typography>
                        <Typography style={{marginTop: 30}}>Żeby zacząć</Typography>
                        <Box className={classes.btnBox}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate("/login")}
                            >
                                Zaloguj się
                            </Button>
                            <Typography style={{margin: "16px 0"}}>lub</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate("/registration")}
                            >
                                Załóż konto
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            );
        } else {
            return (
                <TableProducts />
            );
        }


}