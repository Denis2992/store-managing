import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import {dataContext} from "../../../App";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useNavigate} from "react-router-dom";
import getFirebase from "../../../firebase";




export function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount} = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                <TableCell>Zaznacz wszystko</TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
};

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
                    <IconButton onClick={() => navigate(`/app/settings/newCategory`)}>
                        <AddCircleOutlineIcon color="success" />
                    </IconButton>
                </Tooltip>
            }
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
    const [selected, setSelected] = React.useState([]);
    const {categories, setCategories} = useContext(dataContext);
    const page = 0;
    const rowsPerPage = 100;
    const firebase = getFirebase();


    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = categories?.map((n) => n.id);
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
        const selectedObject = categories?.filter(item => selected.includes(item.id));
        const ids = selectedObject.map(item => item.id);

        let db = firebase.firestore();
        let budgetRef = db.collection(`categories`);

        ids.forEach(el => {
            budgetRef.where("id", "==", el)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        doc.ref.delete().then(() => {
                            console.log("Document successfully deleted!");
                            setCategories(categories.filter(item => !selected.includes(item.id)));
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
                <EnhancedTableToolbar numSelected={selected.length} onDeleteItem={() => handleDeleteItem()}/>
                <TableContainer sx={{maxHeight: 400}}>
                    <Table
                        sx={{ minWidth: 400 }}
                        size="small"
                        stickyHeader
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={categories?.length}
                        />
                        <TableBody>
                            {categories
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
                                                {row.category}
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