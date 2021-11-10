import React from "react";
import {Box, Divider, Paper, TextField, Typography} from "@mui/material";

export default function NewEntry () {
    return (
        <Box>
            <Paper>
                <Typography>Nowy wpis</Typography>
                <Divider variant="middle"/>
                <form>
                    <TextField variant="outlined" label="Nazwa produktu"/>
                </form>
            </Paper>
        </Box>
    )
}