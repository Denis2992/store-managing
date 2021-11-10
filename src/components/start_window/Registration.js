import React, {useContext, useState} from "react";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {useNavigate} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useStyles from "./styles";
import getFirebase from "../../firebase";
import {currentUserContext} from "../../App";


const schema = yup.object({
    name: yup
        .string()
        .min(3, "Pole ma zawierać minimum 3 znaki")
        .matches(/^[A-Za-z]+$/i, "Pole nie może mieć liczb")
        .required("Pole nie może być puste"),
    surname: yup
        .string()
        .min(3, "Pole ma zawierać minimum 3 znaki")
        .matches(/^[A-Za-z]+$/i, "Pole nie może mieć liczb")
        .required("Pole nie może być puste"),
    position:yup
        .string()
        .min(3, "Pole ma zawierać minimum 3 znaki")
        .required("Pole nie może być puste"),
    email: yup
        .string()
        .email("Wprowadź poprawny email")
        .max(50, "Maksymalna długość 50 znaków")
        .required("Pole nie może być puste"),
    password: yup
        .string()
        .min(6, "Minimalna długość 6 znaków")
        .required("Wprowadź hasło"),
    confPassword: yup
        .string()
        .required("Powtórz hasło")
        .oneOf([yup.ref("password"), null], "Hasła maja byc jednakowe")
}).required();

export default function Registration () {
    const classes = useStyles();
    const navigate = useNavigate();
    const [regData, setRegData] = useState({
        name: "",
        surname: "",
        position: "",
        email: "",
        password: "",
        confPassword: "",
    });
    const [notSentError, setNotSentError] = useState(false);
    const firebase = getFirebase();
    const {setCurrentUser} = useContext(currentUserContext);
    const { register, control, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const handleValueChange = (e) => {
        const {name, value} = e.target;
        setRegData(prevState => ({...prevState, [name]: value}))
    }

    const onSubmit = async () => {
        // const date = new Date();
        // const dateToSend = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        // const minutes = () => {
        //     if (date.getMinutes() < 10) {
        //         return "0" + date.getMinutes();
        //     } else {
        //         return date.getMinutes();
        //     }
        // };
        // const timeToSend = `${date.getHours()}:${minutes()}`;

        try {
            if (firebase) {
                const user = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(regData.email, regData.password);
                console.log("user", user);
                setCurrentUser(regData.email);
                navigate("/app");
                setNotSentError(false);

                const db = firebase.firestore();
                const userData = db.collection("users");

                userData.doc(`${regData.email}`).set({
                    name: regData.name,
                    surname: regData.surname,
                    position:regData.position,
                    email: regData.email,
                })
                    .then(() => {
                        console.log('Document Added');

                    })
                    .catch(function (error) {
                        console.error('Error adding document: ', error);

                    });
            }
        } catch (error) {
            console.log("error", error);
            setNotSentError(true);
        }
    };

    return (
        <Box className={classes.mainContainer}>
            <Paper className={classes.regLogWindow} elevation={20} style={{maxHeight: 642}}>
                <ArrowBackIosIcon
                    color="secondary"
                    style={{cursor: "pointer"}}
                    onClick={() => navigate("/start")}
                />
                <Typography variant="h5" align="center">Załóż konto</Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="name"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.name}
                                size="small"
                                margin="normal"
                                label="Imię"
                                helperText={errors?.name?.message}
                                className={classes.input}
                                value={regData.name}
                                {...register("name")}
                                onChange={handleValueChange}
                            />
                        )}
                    />
                    <Controller
                        name="surname"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.surname}
                                size="small"
                                margin="normal"
                                label="Nazwisko"
                                helperText={errors?.surname?.message}
                                className={classes.input}
                                value={regData.surname}
                                {...register("surname")}
                                onChange={handleValueChange}
                            />
                        )}
                    />
                    <Controller
                        name="position"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.position}
                                size="small"
                                margin="normal"
                                label="Stanowisko"
                                helperText={errors?.position?.message}
                                className={classes.input}
                                value={regData.position}
                                {...register("position")}
                                onChange={handleValueChange}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.email}
                                size="small"
                                margin="normal"
                                label="Email"
                                helperText={errors?.email?.message}
                                className={classes.input}
                                value={regData.email}
                                {...register("email")}
                                onChange={handleValueChange}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.password}
                                size="small"
                                margin="normal"
                                label="Hasło"
                                type="password"
                                helperText={errors?.password?.message}
                                className={classes.input}
                                value={regData.password}
                                {...register("password")}
                                onChange={handleValueChange}
                            />
                        )}
                    />
                    <Controller
                        name="confPassword"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.confPassword}
                                size="small"
                                margin="normal"
                                label="Powtórz hasło"
                                type="password"
                                helperText={errors?.confPassword?.message}
                                className={classes.input}
                                value={regData.confPassword}
                                {...register("confPassword")}
                                onChange={handleValueChange}
                            />
                        )}
                    />
                    <Box className={classes.errorBox}>
                        {notSentError ? (
                            <Typography
                                variant="caption"
                                color="error"
                            >
                                Email jest zajęty
                            </Typography>
                        ) : null
                        }
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"

                        type="submit"
                    >
                        Załóż konto
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}