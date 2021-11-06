import React, {useState} from "react";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {useNavigate} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useStyles from "./styles";


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
    const { register, control, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = () => {

        console.log("ok");
    };

    return (
        <Box className={classes.mainContainer}>
            <Paper className={classes.regLogWindow} elevation={20}>
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
                                className={classes.input}
                                helperText={errors?.password?.message}
                                value={password}
                                {...register("password")}
                                onChange={e => setPassword(e.target.value)}
                            />
                        )}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{marginTop: 8}}
                        type="submit"
                    >
                        Zaloguj się
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}