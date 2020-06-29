//importando dependencias
import {makeStyles} from "@material-ui/styles"
import axios from 'axios'
import { 
    Grid,
    Snackbar,
    Container,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState }  from 'react';
//Styles
const styles =  makeStyles( themes => ({
    mainColor: {
        background: "#000000",
    },
    formLogin: {
        width: 300,
        height: 200,
        background: "white",
        borderRadius: 10,
    },
    signinButton: {
        background: "#9A12FA",
        "&:hover": {
            backgroundColor: "#B900F0"
        }
    },
    signupButton: {
        marginLeft: "44%",
        background: "#6C3AF0",
        "&:hover": {
            backgroundColor: "#8C6AF0"
        }
    },
    textFieldsGeneral: {
        marginLeft: 10
    },
    avatarlogo: {
        width: 250,
        height: 250,
        position: "fixed",
        marginLeft: -10
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
/**
 * functional component
 * View Login 
 * @param {*} props
 * @returns render
*/
const Login = (props) => {
    const { history } = props;

    const [email, setEmail] =  useState("");
    const [pass, setPass] =  useState("");  

    const [newEmail, setNewEmail] = useState("");
    const [newPass, setNewPass] =  useState("");
    const [newNick, setNewNick] = useState("");
    const [newCountry, setNewCountry] = useState("");
    const [newCity, setNewCity] = useState("");
    const [newState, setNewState] = useState("");
    const [newZip, setNewZip] = useState("");
    const [newName, setNewName] = useState("");
    const [newAddress, setNewAddress] = useState("");


    const [openDialog, setOpen] = useState(false);
    const [fallBackLogin, setFallBack] = useState(false);

    function redirect() {
        console.log(email);
        const user = {
            email: email,
            name: newName
        }
        history.push("/inbox", user);
    }

    //#region handle all inputs with states
    function _handleEmail(e) {
        setEmail(e.target.value);
    }   

    function _handlePass(e) {
        setPass(e.target.value);
    }

    function _handleNewEmail(e) {
        setNewEmail(e.target.value);
    }

    function _handleNewPass(e) {
        setNewPass(e.target.value);
    }

    function _handleNewNick(e) {
        setNewNick(e.target.value);
    }

    function _handleNewCountry(e) {
        setNewCountry(e.target.value);
    }

    function _handleNewCity(e) {
        setNewCity(e.target.value);
    }

    function _handleNewState(e) {
        setNewState(e.target.value);
    }

    function _handleNewZip(e) {
        setNewZip(e.target.value);
    }

    function _handleNewName(e) {
        setNewName(e.target.value);
    }

    function _handleNewAdress(e) {
        setNewAddress(e.target.value);
    }
    //#endregion

    /**
     * Handle close dialog of register new client
     */
    function _handleCloseDialog() {
        setOpen(false);
    };

    /**
     * Handle open dialog of register new client
     */
    function _handleOpenDialog() {
        setOpen(true)
    }
    
    /**
     * Handle clear alert
     * @param {*} event 
     * @param {*} reason 
     */
    function _handleCloseAlert(event, reason) {
        if (reason === 'clickaway') {
          return;
        }
        setFallBack(false);
      };

    /**
     * This function controls the login by calling the back-end API 
     */
    function verifiedLogin() {
        axios.post("http://darkemail.me:3000/user/login", {
            email: email,
            password: pass
        })
        .then(result => {
            if (result.data.status === 'User is not confirmed.' || result.data.status === 'ok') {
                redirect();
            } else {
                setFallBack(true);
            }      
        })
    }

    /**
     * This function controls the creation of a user by calling the back-end API,
     * passing all the necessary parameters for the call.
     */
    function registerUser() {
        axios.post("http://darkemail.me:3000/user/create", {
            email: newEmail,
            password: newPass,
            nickname: newNick,
            name: newName,
            address: newAddress,
            city: newCity,
            country: newCountry
        }).then(result => {
            const status = result.data;
            if (status.status === 'ok') {
                _handleCloseDialog();
            }
        }).catch(err => {

        })
    }

    const classes = styles();
    return (
        <div className={classes.mainColor}>
            <Grid container spacing={10} justify="center" alignItems="center" style={{ minHeight: '100vh', maxWidth: '100%', bottom: '50%', margin: '0px'}}>
            <img className={classes.avatarlogo} style={{bottom: "68%"}} src={"https://i.postimg.cc/mDmb3D61/Dark-Email-5.png"}></img>
                <Container className={classes.formLogin} >
                    <form >
                        <TextField label="Email" value={email} onChange={_handleEmail} style={{width: "250px", marginBottom: "10px", marginTop: "10px"}}/>
                        <TextField label="Password" type="password" value={pass} onChange={_handlePass} style={{width: "250px", marginBottom: "10px"}}/>
                    </form>
                    <Button className={classes.signinButton} style={{marginTop: "20px"}} onClick={verifiedLogin}>Sign In</Button>
                    <Button className={classes.signupButton} style={{marginTop: "20px"}} onClick={_handleOpenDialog}>Sign Up</Button>
                </Container>
            </Grid>
            <Dialog open={openDialog} onClose={_handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">DarkEmail Register</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sign up for DarkEmail!
                        An email verification will be sent to you so that you can send email
                    </DialogContentText>
                    <TextField label="Nickname" value={newNick} onChange={_handleNewNick}/>
                    <TextField className={classes.textFieldsGeneral}label="Name" value={newName} onChange={_handleNewName}/>
                    <TextField className={classes.textFieldsGeneral} label="Address" value={newAddress} onChange={_handleNewAdress}/>
                    <TextField label="City" value={newCity} onChange={_handleNewCity}/>
                    <TextField className={classes.textFieldsGeneral} label="State" value={newState} onChange={_handleNewState}/>
                    <TextField className={classes.textFieldsGeneral} label="Zip" value={newZip} onChange={_handleNewZip}/>
                    <TextField value={newCountry} onChange={_handleNewCountry} label="Country"/>
                    <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" fullWidth value={newEmail} onChange={_handleNewEmail}/>
                    <TextField margin="dense" id="pass" label="Password" type="password" fullWidth value={newPass} onChange={_handleNewPass}/> 
                </DialogContent>
                <DialogActions>
                    <Button onClick={_handleCloseDialog}>
                    Cancel
                    </Button>
                    <Button onClick={registerUser} color="primary">
                    Register
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={fallBackLogin} autoHideDuration={6000} onClose={_handleCloseAlert}>
                <Alert severity="error" onClose={_handleCloseAlert}>
                    Email or password incorrect!! Try again
                </Alert>
            </Snackbar>
        </div>
    )
}
//Export Login
export default Login;