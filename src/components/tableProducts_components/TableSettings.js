import React, {useContext} from "react";
import {makeStyles} from "@mui/styles";
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {IconButton, Paper, Tooltip} from "@mui/material";
import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import CategoriesTable from "./tableSettings_components/CategoriesTable";
import UnitsTable from "./tableSettings_components/UnitsTable";
import {dataContext} from "../../App";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`action-tabpanel-${index}`}
            aria-labelledby={`action-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `action-tab-${index}`,
        'aria-controls': `action-tabpanel-${index}`,
    };
}



const useStyles = makeStyles((theme) => ({
    mainBox: {
        position: "absolute",
        zIndex: 2,
        height: "calc(100vh - 70px)",
        maxWidth: 1500,
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
        height: "calc(100% - 50%)",
        marginTop: 100,


    },
    appBar: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    backBtn: {
        zIndex: 5,
        width: 40
    },
    list: {
        height: 450,
        overflowY: "scroll",
    },
    listItem: {
        display: "flex",
        alignItems: "center",
    },

}));

export default function TableSettings () {
    const classes = useStyles();
    const theme = useTheme();
    const {tableSettingsCard, setTableSettingsCard} = useContext(dataContext);
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setTableSettingsCard(newValue);
    };

    const handleChangeIndex = (index) => {
        setTableSettingsCard(index);
    };

    return (
        <Box className={classes.mainBox}>
            <Paper
                sx={{
                    bgcolor: 'background.paper',
                    width: 500,
                    position: 'relative',
                    minHeight: 200,
                }}
                className={classes.paper}
            >
                <AppBar position="static" color="default" className={classes.appBar}>
                    <IconButton className={classes.backBtn} onClick={() => navigate("/app")}>
                        <Tooltip title="Wróć">
                            <ArrowBackIosIcon color="primary" style={{transform: "translate(5px, 0)"}}/>
                        </Tooltip>
                    </IconButton>
                    <Tabs
                        value={tableSettingsCard}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="action tabs example"
                    >
                        <Tab label="Kategorie" {...a11yProps(0)} />
                        <Tab label="Jednostki" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tableSettingsCard}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={tableSettingsCard} index={0} dir={theme.direction}>
                        <CategoriesTable />
                    </TabPanel>
                    <TabPanel value={tableSettingsCard} index={1} dir={theme.direction} >
                        <UnitsTable />
                    </TabPanel>
                </SwipeableViews>
            </Paper>
        </Box>
    );
}