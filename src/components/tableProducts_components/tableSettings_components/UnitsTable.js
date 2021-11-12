import React, {useContext, useState} from "react";
import {EnhancedTableToolbar} from "./CategoriesTable";
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