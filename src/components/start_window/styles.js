import {makeStyles} from "@mui/styles";


const useStyles = makeStyles((theme) => ({
    mainContainer: {
        display: "flex",
        justifyContent: "center",
    },
    welcomeWindow: {
        transform: "translate(0, 200px)",
        height: 250,
        maxWidth: 400,
        width: "100%",
        border: `2px solid ${theme.palette.primary.main}`,
        padding: theme.spacing(2),
        margin:theme.spacing(2),
        textAlign: "center",
        [theme.breakpoints.down(450)]: {
            transform: "translate(0, 100px)",
        }
    },
    btnBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: theme.spacing(2)
    },
    regLogWindow: {
        transform: "translate(0, 200px)",
        padding: theme.spacing(2),
        border: `2px solid ${theme.palette.primary.main}`,
        width: 300,
        [theme.breakpoints.down(450)]: {
            transform: "translate(0, 100px)",
        }
    },
    form: {
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    input: {
        width: 250,
        height: 60
    }
}));

export default useStyles;