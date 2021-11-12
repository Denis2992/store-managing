import React, {useContext, useState} from "react";
import {newCategoryStyles} from "./NewCategory";
import {useNavigate} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Box, Button, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import {ArrowBackIosNewOutlined} from "@mui/icons-material";
import * as yup from "yup";
import {dataTableContext} from "./DataTable";
import getFirebase from "../../firebase";


const schema = yup.object({
    unit: yup.string().required("Pole nie może byc puste"),
}).required();

export default function NewUnit () {
    const classes = newCategoryStyles();
    const navigate = useNavigate();
    const [unit, setUnit] = useState("");
    const {units, setUnits, setTableSettingsCard} = useContext(dataTableContext);
    const [sameUnitErr, setSameUnitErr] = useState(false);
    const { register, control, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const firebase = getFirebase();

    const handleAddUnit = () => {
        const ids = units?.map(el => el.id);

        const dataToSend = {
            id: units?.length === 0 ? 1 : (Math.max(...ids) + 1),
            unit: unit,
        };

        if (!units?.find(el => el.unit === unit)) {
            try {
                const db = firebase.firestore()
                const categoriesRef = db.collection("units");

                categoriesRef.doc().set(dataToSend)
                    .then(() => {
                        console.log('Document Added');
                        setUnits(prevState => [...prevState, dataToSend]);
                        navigate("/app/settings");
                        setTableSettingsCard(1);
                    })
                    .catch((err) => {
                        console.log('Error adding document: ', err);
                    })
            } catch (error) {
                console.log("error", error);
            }
        } else {
            setSameUnitErr(true)
        }
    };

    return (
        <Box className={classes.box}>
            <Paper className={classes.paper}>
                <Tooltip title="Wróć">
                    <IconButton onClick={() => navigate("/app/settings")}>
                        <ArrowBackIosNewOutlined color="primary"/>
                    </IconButton>
                </Tooltip>
                <Typography align="center" variant="h6">Dodaj jednostkę</Typography>
                <form className={classes.form} onSubmit={handleSubmit(handleAddUnit)}>
                    <Controller
                        name="unit"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.unit}
                                label="Nowa jednostka"
                                placeholder="Nowa jednostka"
                                size="small"
                                helperText={errors?.unit?.message}
                                className={classes.input}
                                {...register("unit")}
                                value={unit}
                                onChange={e => setUnit(e.target.value)}
                            />
                        )}
                    />
                    <Box style={{height: 15}}>
                        {sameUnitErr ? (
                            <Typography
                                variant="caption"
                                color="error"
                            >
                                Taka jednostka juz istnieje
                            </Typography>
                        ) : null}
                    </Box>
                    <Button type="submit" variant="contained" style={{marginTop: 8}}>Dodaj</Button>
                </form>
            </Paper>
        </Box>
    );
}