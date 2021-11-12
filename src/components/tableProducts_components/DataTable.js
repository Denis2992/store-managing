import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import {makeStyles} from "@mui/styles";
import {useContext,  useState} from "react";
import { useNavigate} from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import {dataContext} from "../../App";
import EditIcon from '@mui/icons-material/Edit';
import getFirebase from "../../firebase";




function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {id: 'id', label: 'ID', disablePadding: true},
    {id: 'product', label: 'Nazwa produktu', disablePadding: true},
    {id: 'category', label: 'Kategoria', disablePadding: true},
    {id: 'quantity', label: 'Ilość', disablePadding: true},
    {id: 'units', label: 'Jednostki', disablePadding: true},
    {id: 'date', label: 'Data', disablePadding: true},
    {id: 'employee', label: 'Pracownik', disablePadding: true}
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

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
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const { numSelected, onDeleteItem, onEditItem } = props;
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
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}

            {numSelected > 0 ? (
                <>
                    {numSelected > 1 ? (
                        <IconButton disabled>
                            <EditIcon />
                        </IconButton>
                    ) : (
                        <Tooltip title="Edytuj">
                            <IconButton aria-label="edit" onClick={onEditItem}>
                                <EditIcon color="warning"/>
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Usuń">
                        <IconButton onClick={onDeleteItem}>
                            <DeleteIcon color="error"/>
                        </IconButton>
                    </Tooltip>
                </>

            ) : (
                <>
                    <Tooltip title="Nowy wpis">
                        <IconButton onClick={() => navigate("/app/newEntry")}>
                            <AddCircleOutlineIcon color="success"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Ustawienia">
                        <IconButton onClick={() => navigate("/app/settings")}>
                            <SettingsIcon color="primary"/>
                        </IconButton>
                    </Tooltip>
                </>

            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    mainBox: {
        margin: "0 auto",
        position: "relative",

    },
    paper: {
        border: `2px solid ${theme.palette.secondary.light}`,
        margin: "32px auto",
    }
}));


function NavigationIcon() {
    return null;
}



NavigationIcon.propTypes = {sx: PropTypes.shape({mr: PropTypes.number})};
export default function DataTable() {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');

    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const firebase = getFirebase();
    const navigate = useNavigate();
    const {dataTable, setDataTable, setSingleData, setEditMode, setSelected, selected} = useContext(dataContext);


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = dataTable.map((n) => n.id);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length) : 0;

    const handleDeleteItem = () => {
        const selectedObject = dataTable?.filter(item => selected.includes(item.id));
        const ids = selectedObject.map(item => item.id);

        let db = firebase.firestore();
        let budgetRef = db.collection("data");

        ids.forEach(el => {
            budgetRef.where("id", "==", el)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        doc.ref.delete().then(() => {
                            console.log("Document successfully deleted!");
                            setDataTable(dataTable.filter(item => !selected.includes(item.id)));
                        }).catch(error => {
                            console.log("Error removing document: ", error);
                        });
                    });
                })
                .catch(error => {
                    console.log("Error getting documents: ", error);
                });
        });
        setSelected([]);
    };

    const handleEditItem =  () => {

        const data = dataTable?.filter(item => item.id === selected[0]);

        setSingleData({
            id: data[0].id,
            product: data[0].product,
            category: data[0].category,
            quantity: data[0].quantity,
            units: data[0].units,
            date: data[0].date,
            employee: data[0].employee
        });
        setEditMode(true);
        navigate(`/app/edit`);
    };

    return (
        <Box sx={{ width: '100%' }} className={classes.mainBox}><FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Małe komórki"
        /><Paper sx={{ width: '90%', mb: 2 }} className={classes.paper}>
            <EnhancedTableToolbar
                numSelected={selected.length}
                onDeleteItem={handleDeleteItem}
                onEditItem={handleEditItem}
            />
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                    stickyHeader
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={dataTable.length}
                    />
                    <TableBody>
                        {/* if you don't need to support IE11, you can replace the `stableSort` call with:
               rows.slice().sort(getComparator(order, orderBy)) */}
                        {stableSort(dataTable, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`
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
                                            padding="none"
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="left" padding="none">{row.product}</TableCell>
                                        <TableCell align="left" padding="none">{row.category}</TableCell>
                                        <TableCell align="left" padding="none">{row.quantity}</TableCell>
                                        <TableCell align="left" padding="none">{row.units}</TableCell>
                                        <TableCell align="left" padding="none">{row.date}</TableCell>
                                        <TableCell align="left" padding="none">{row.employee}</TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: (dense ? 33 : 53) * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={dataTable.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper></Box>
    );
}
