import React, {useContext, useState} from "react";
import {EnhancedTableHead} from "./CategoriesTable";
import {dataContext} from "../../../App";
import getFirebase from "../../../firebase";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import {useNavigate} from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import {alpha} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";


const EnhancedTableToolbar = (props) => {
    const { numSelected, onDeleteItem } = props;
    const navigate = useNavigate();

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
            style={{borderTopLeftRadius: 10, borderTopRightRadius: 10,}}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} wybrano
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Dodawaj / Usuwaj kategorię
                </Typography>
            )}

            {numSelected > 0 ? (
                    <Tooltip title="Delete" color="error">
                        <IconButton onClick={onDeleteItem}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) :
                <Tooltip title="Dadaj kategorie">
                    <IconButton onClick={() => navigate(`/app/settings/newUnit`)}>
                        <AddCircleOutlineIcon color="success" />
                    </IconButton>
                </Tooltip>
            }
        </Toolbar>
    );
};

export default function UnitsTable () {
    const [selected, setSelected] = useState([]);
    const {units, setUnits} = useContext(dataContext);
    const page = 0;
    const rowsPerPage = 100;
    const firebase = getFirebase();



    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = units?.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleDeleteItem = () => {
        const selectedObject = units?.filter(item => selected.includes(item.id));
        const ids = selectedObject.map(item => item.id);

        let db = firebase.firestore();
        let budgetRef = db.collection("units");

        ids.forEach(el => {
            budgetRef.where("id", "==", el)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        doc.ref.delete().then(() => {
                            console.log("Document successfully deleted!");
                            setUnits(units.filter(item => !selected.includes(item.id)));
                        }).catch(error => {
                            console.log("Error removing document: ", error);
                        });
                    });
                })
                .catch(error => {
                    console.log("Error getting documents: ", error);
                })
        })
        setSelected([]);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ width: '100%', mb: 2,  overflow: 'hidden'}}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    onDeleteItem={() => handleDeleteItem()}
                    optionName={"jednostkę"}
                />
                <TableContainer sx={{maxHeight: 400}}>
                    <Table
                        sx={{ minWidth: 400 }}
                        size="small"
                        stickyHeader
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={units?.length}
                            pass={"newUnit"}
                        />
                        <TableBody>
                            {units
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {row.unit}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}