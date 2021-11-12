import React, {useContext, useEffect} from "react";
import {
    Box, Button,
    Divider,
    FormControl, IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {makeStyles} from "@mui/styles";
import {useNavigate} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {dataContext} from "../../App";
import getFirebase from "../../firebase";

const useStyles = makeStyles((theme) => ({
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
    },
    paper: {
        border: `2px solid ${theme.palette.secondary.main}`,
        padding: 16,
        marginTop: 80,
        width: 300,
        maxHeight: 446
    },
    divider: {
        backgroundColor: theme.palette.secondary.main,
        height: 1,

    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
    },
    input: {
        width: 250,
        height: 60
    }
}));

const schema = yup.object({
    product: yup.string().min(3, "pole ma zawierać minimum 3 znaki").required("pole nie może byc puste"),
    category: yup.string().required("Wybierz kategorię"),
    quantity: yup.number().required("pole nie może byc puste").typeError("pole może zawierać tylko liczby"),
    units: yup.string().required("Wybierz jednostki"),
}).required();

export default function NewEntry () {
    const classes = useStyles();
    const navigate = useNavigate();
    const {
        singleData, setSingleData,
        categories, units,
        dataTable, setDataTable,
        userData,editMode, setEditMode,
        setSelected
    } = useContext(dataContext);

    const firebase = getFirebase();
    const { register, control, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const date = new Date();
    const fullDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

    const handleValueChange = (e) => {
        const {name, value} = e.target;
        setSingleData(prevState => ({...prevState, [name]: value}))
    };

    const handleAddNewData = async () => {
        const ids = dataTable?.map(el => el.id);

        const dataToSend = {
            id: dataTable.length === 0 ? 1 : (Math.max(...ids) + 1),
            product: singleData.product,
            category: singleData.category,
            quantity: singleData.quantity,
            units: singleData.units,
            date: fullDate,
            employee: `${userData?.name} ${userData?.surname}`
        };

        if (firebase) {
            try {
                const db = firebase.firestore()
                const dataRef = db.collection(`data`);

                dataRef.doc().set(dataToSend)
                    .then(function () {
                        console.log('Document Added');
                        setDataTable(prevState => [...prevState, dataToSend]);
                        setSingleData({
                            id: "",
                            product: "",
                            category: "",
                            quantity: "",
                            units: "",
                            date: "",
                            employee: ""
                        });
                        navigate("/app");
                    })
                    .catch(function (error) {
                        console.error('Error adding document: ', error);
                    });
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    const handleSaveEditData = async () => {

        const dataToSend = {
            id: singleData.id,
            product: singleData.product,
            category: singleData.category,
            quantity: singleData.quantity,
            units: singleData.units,
            date: fullDate,
            employee: `${userData?.name} ${userData?.surname}`
        };

        const db = firebase.firestore();
        const dataRef = db.collection("data");

        dataRef.where("id", "==", singleData.id)
            .get()
            .then(querySnapShot => {
                querySnapShot.forEach(doc => {
                    doc.ref.update(dataToSend).then(() => {
                        console.log("Document successfully edited!");
                        setDataTable([...dataTable?.filter(item => item.id !== dataToSend.id), dataToSend]);
                        setSingleData({
                            id: "",
                            product: "",
                            category: "",
                            quantity: "",
                            units: "",
                            date: "",
                            employee: ""
                        })
                        navigate("/app");
                        setSelected([]);
                        setEditMode(false);
                    }).catch(error => {
                        console.log("Error removing document: ", error);
                    });
                });
            })
            .catch(error => {
                console.log("Error getting documents: ", error);
            })

    };

    const handleSendForm = () => {
        if (editMode) {
            return handleSaveEditData();
        } else {
            return handleAddNewData();
        }
    };

    return (
        <Box className={classes.box}>
            <Paper className={classes.paper} elevation={20}>
                <IconButton onClick={() => navigate("/app")} style={{transform: "translate(270px, -10px)"}}>
                    <CloseIcon color="error" />
                </IconButton>
                {!editMode ? (
                    <Typography variant="h5" align={"center"}>Nowy wpis</Typography>
                ) : (
                    <Typography variant="h5" align={"center"}>Edytuj</Typography>
                )}
                <Divider className={classes.divider} style={{margin: "16px 0", alignSelf: "initial"}}/>
                <form className={classes.form} onSubmit={handleSubmit(handleSendForm)}>
                    <Controller
                        name="product"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors?.product}
                                size="small"
                                className={classes.input}
                                variant="outlined"
                                label="Nazwa produktu"
                                margin="dense"
                                helperText={errors?.product?.message}
                                {...register("product")}
                                value={singleData?.product}
                                onChange={handleValueChange}
                            />
                        )}
                    />
                    <Controller
                        name="category"
                        control={control}
                        render={() => (
                            <FormControl
                                margin="dense"
                                size="small"
                                className={classes.input}
                                error={!!errors?.category}
                            >
                                <InputLabel id="category">Kategoria</InputLabel>
                                <Select
                                    label="Kategoria"
                                    {...register("category")}
                                    value={singleData?.category}
                                    onChange={handleValueChange}
                                >
                                    {categories?.map(el => (
                                        <MenuItem key={el.id} value={el.category}>{el.category}</MenuItem>
                                    ))}
                                </Select>
                                <Typography
                                    variant="caption"
                                    color="error"
                                    style={{height:20, margin: "4px 14px 0 14px"}}
                                >
                                    {errors?.category?.message}
                                </Typography>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="quantity"
                        control={control}
                        render={() => (
                            <TextField
                                error={!!errors.quantity}
                                variant="outlined"
                                label="Ilość"
                                margin="dense"
                                size="small"
                                helperText={errors?.quantity?.message}
                                className={classes.input}
                                {...register("quantity")}
                                value={singleData?.quantity}
                                onChange={handleValueChange}
                            />
                        )}
                    />
                    <Controller
                        name="units"
                        control={control}
                        render={() => (
                            <FormControl
                                margin="dense"
                                size="small"
                                className={classes.input}
                                error={!!errors?.units}
                            >
                                <InputLabel id="units">Jednostki</InputLabel>
                                <Select
                                    label="Jednostki"
                                    {...register("units")}
                                    value={singleData?.units}
                                    onChange={handleValueChange}
                                >
                                    {units?.map(el => (
                                        <MenuItem key={el.id} value={el.unit}>{el.unit}</MenuItem>
                                    ))}
                                </Select>
                                <Typography
                                    variant="caption"
                                    color="error"
                                    style={{height:20, margin: "4px 14px 0 14px"}}
                                >
                                    {errors?.units?.message}
                                </Typography>
                            </FormControl>
                        )}
                    />
                    <Button variant="contained" style={{marginTop: "16px"}} type="submit">Zapisz</Button>
                </form>
            </Paper>
        </Box>
    );
}