import React, {useState} from "react";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {useNavigate} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useStyles from "./styles";
import getFirebase from "../../firebase";


const schema = yup.object({
    email: yup
        .string()
        .email("Wprowadź poprawny email")
        .max(50, "Maksymalna długość 50 znaków")
        .required("Pole nie może być puste"),
    password: yup
        .string()
        .min(6, "Hasło ma zawierać minimum 6 znaków")
        .required("Wprowadź hasło")
}).required();


export default function Login () {
    const classes = useStyles();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notSentErr, setNotSentErr] = useState(false);
    const firebase = getFirebase();
    const { register, control, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async () => {
        try {
            if (firebase) {
                const user = await firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password);
                console.log("user", user);
                setNotSentErr(false);
                navigate("/app");
            }
        }catch (error) {
            console.log("error", error);
            setNotSentErr(true);
            console.log(notSentErr)
        }
    };

    return (
        <Box className={classes.mainContainer}>
            <Paper className={classes.regLogWindow} elevation={20} style={{maxHeight: 305}}>
                <ArrowBackIosIcon
                    color="secondary"
                    style={{cursor: "pointer", alignSelf: "flex-end"}}
                    onClick={() => navigate("/start")}
                />
                <Typography variant="h5" align="center">Zaloguj się</Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="email"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.email}
                                margin="normal"
                                size="small"
                                label="Email"
                                className={classes.input}
                                helperText={errors?.email?.message}
                                value={email}
                                {...register("email")}
                                onChange={e => setEmail(e.target.value)}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.password}
                                margin="normal"
                                size="small"
                                label="Hasło"
                                type="password"
                                className={classes.input}
                                helperText={errors?.password?.message}
                                value={password}
                                {...register("password")}
                                onChange={e => setPassword(e.target.value)}
                            />
                        )}
                    />
                    <Box className={classes.errorBox}>
                        {notSentErr ? (
                            <Typography
                                variant="caption"
                                color="error"
                            >
                                Nie poprawny email lub hasło</Typography>
                        ) : null
                        }
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                    >
                        Zaloguj się
                    </Button>

                </form>
            </Paper>
        </Box>
    );
}