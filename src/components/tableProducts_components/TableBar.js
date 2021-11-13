import React, {useContext, useState} from "react";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {headCells} from "./DataTable";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {dataContext} from "../../App";

const useStyles = makeStyles((theme) => ({
    mainBox: {
        margin: "32px auto 0",
        width: "90%",
        display: "flex",
        alignItems: "center"
    },
    form: {
        display: "flex",
        alignItems: "center"
    },
    input: {
        width: 260,
        height: 60
    }
}));

const schema = yup.object({
    searchInput: yup.string().required("Wpisz czego szukasz"),
}).required();


export default function TableBar (props) {
    const {switchPadding, switchPaddingOnChange} = props;
    const classes = useStyles();
    const [category, setCategory] = useState("0");
    const [searchInput, setSearchInput] = useState("");
    const {dataTable, setDataTable} = useContext(dataContext);
    const [storedData, setStoredData] = useState("");
    const [showBar, setShowBar] = useState(true);
    const { register, control, handleSubmit, formState:{ errors } } = useForm({
        resolver: yupResolver(schema)
    });


    const onSubmit = () => {
        setStoredData(dataTable);
        let filteredData;

        switch (category) {
            case "id":
                filteredData = dataTable.filter(el => el.id === parseInt(searchInput));
                break;
            case "product":
                filteredData = dataTable.filter(el => el.product.includes(searchInput));
                break;
            case "category":
                filteredData = dataTable.filter(el => el.category.includes(searchInput));
                break;
            case "quantity":
                filteredData = dataTable.filter(el => el.quantity.includes(searchInput));
                break;
            case "units":
                filteredData = dataTable.filter(el => el.units.includes(searchInput));
                break;
            case "date":
                filteredData = dataTable.filter(el => el.date.includes(searchInput));
                break;
            case "employee":
                filteredData = dataTable.filter(el => el.employee.includes(searchInput));
                break;
            default:
        }

        setDataTable(filteredData);
        setShowBar(false)
    };

    const deleteResult = () => {
        setCategory("0");
        setDataTable(storedData);
        setSearchInput("");
        setShowBar(true);
    }

    return (
        <Box className={classes.mainBox}>
            <FormControlLabel
                control={<Switch checked={switchPadding} onChange={switchPaddingOnChange} />}
                label="Małe komórki"
                style={showBar ? {transform: "translate(0, -9px)"} : {transform: "translate(0, 0)"}}
            />
            {showBar ? (
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <FormControl className={classes.input} size="small">
                        <InputLabel id="category">Kategoria</InputLabel>
                        <Select
                            name="category"
                            label="Kategoria"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <MenuItem disabled value="0">Wybierz kategorię</MenuItem>
                            {headCells.map(el => (
                                <MenuItem key={el.id} value={el.id}>{el.label}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText color="primary">szukaj według kategorii</FormHelperText>
                    </FormControl>
                    <Box style={{display: "flex"}}>
                        {category !== "0" ? (
                            <>
                                <Controller
                                    name="searchInput"
                                    control={control}
                                    render={() => (
                                        <TextField
                                            error={!!errors?.searchInput}
                                            variant="outlined"
                                            placeholder="Wpisz słowo, date, liczbę, literę"
                                            size="small"
                                            className={classes.input}
                                            style={{margin: "0 16px"}}
                                            helperText={errors?.searchInput?.message}
                                            {...register("searchInput")}
                                            value={searchInput}
                                            onChange={e => setSearchInput(e.target.value)}
                                        />
                                    )}
                                />
                                <Button
                                    variant="contained"
                                    type="submit"
                                    style={{height: 40}}
                                >
                                    Szukaj
                                </Button>
                            </>
                        ): null}
                    </Box>
                </form>
            ): (
                <>
                    {dataTable.length !== 0 ? (
                        <Typography>Szukałeś: {searchInput}</Typography>
                    ) : (
                        <Typography>Nie znaleziono nic</Typography>
                    )}
                    <Button
                        variant="contained"
                        color="error"
                        style={{height: 40, marginLeft: 16}}
                        onClick={deleteResult}
                    >
                        Usuń wyniki
                    </Button>
                </>

            )}
        </Box>
    )
}