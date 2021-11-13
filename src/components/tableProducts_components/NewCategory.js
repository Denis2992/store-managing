import React, {useContext, useState} from "react";
import {Box, Button, IconButton, TextField, Tooltip, Typography} from "@mui/material";
import {ArrowBackIosNewOutlined} from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import {makeStyles} from "@mui/styles";
import {useNavigate} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import getFirebase from "../../firebase";
import {dataContext} from "../../App";


export const newCategoryStyles = makeStyles((theme) => ({
    box: {
        position: "absolute",
        zIndex: 2,
        height: "calc(100vh - 70px)",
        maxWidth: 1700,
        width: "100%",
        margin: "0 auto",
        backgroundColor: "rgba(77, 171, 245, 0.2)",
        left: 0,
        top: 0,
        display: "flex",
        justifyContent: "center",
        marginTop: 70
    },
    paper: {
        border: `2px solid ${theme.palette.primary.main}`,
        marginTop: 70,
        height: 216
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 16
    },
    input: {
        width: 250,
        height: 60
    }

}));

const schema = yup.object({
    category: yup.string().min(3, "Pole ma zawierać minimum 3 znaki").required("Pole nie może byc puste"),
}).required();

export default function NewCategory () {
    const classes = newCategoryStyles();
    const navigate = useNavigate();
    const [category, setCategory] = useState("");
    const {categories, setCategories} = useContext(dataContext);
    const { register, control, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const firebase = getFirebase();


    const handleAddCategory = () => {
        const ids = categories?.map(el => el.id);

        const dataToSend = {
            id: categories?.length === 0 ? 1 : (Math.max(...ids) + 1),
            category: category,
        };

        if (firebase) {
            try {
                const db = firebase.firestore()
                const categoriesRef = db.collection("categories");

                categoriesRef.doc().set(dataToSend)
                    .then(() => {
                        console.log('Document Added');
                        setCategories(prevState => [...prevState, dataToSend]);
                        navigate("/app/settings");
                    })
                    .catch((err) => {
                        console.log('Error adding document: ', err);
                    })
            } catch (error) {
                console.log("error", error);
            }
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
                <Typography align="center" variant="h6">Dodaj kategorię</Typography>
                <form className={classes.form} onSubmit={handleSubmit(handleAddCategory)}>
                    <Controller
                        name="category"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.category}
                                label="Nowa kategoria"
                                placeholder="Nowa kategoria"
                                size="small"
                                helperText={errors?.category?.message}
                                className={classes.input}
                                {...register("category")}
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            />
                        )}
                    />

                    <Button type="submit" variant="contained" style={{marginTop: 16}}>Dodaj</Button>
                </form>
            </Paper>
        </Box>
    );
};