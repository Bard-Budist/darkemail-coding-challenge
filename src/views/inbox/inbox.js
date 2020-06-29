//importando dependencias
import React, { useState, useRef }  from 'react';
import {makeStyles} from "@material-ui/styles"
import axios from "axios";
import { Grid, Fade, Button, Avatar, TextField, Card, CardContent, Typography, Snackbar } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';

//Estilos
const styles =  makeStyles( theme => ({
    root: {
        background: "black"
    },
    topbar: {
        
    },
    mainColor: {
        height: "-webkit-fill-available",
        background: "black",
    },
    largeAvatar: {
        width: 70,
        height: 70,
        fontSize: 50,
        background: "#9A12FA"
      },
    buttons: {
        background: "white",
        margin: 10
    },
    buttonMessage: {
        background: "#9A12FA",
        margin: 10,
        "&:hover": {
            backgroundColor: "#B900F0"
        }
    },
    boxMessages: {
        position: "fixed",
        marginTop: 100,
        width: 350,
        background: "white",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    sendMessageComponent: {
        background: "white",
        marginLeft: 400,
        marginTop: 20,
        marginRight: 20,
        borderRadius: 10
    },
    mainFields: {
        marginTop: 10,
        marginLeft: 10
    },
    textArea : {
        marginLeft: 10,
        marginRight: -20,
        width: 912,
        height: 425,
        fontSize: 16,
        "&:focus": {
            border: 0
        }

    },
    from: {
        width: "80%",
        marginLeft: 10,
        marginRight: 50,
        height: 30,
        borderRadius: 2,
        
    }
    ,subject: {
        width: "80%",
        marginLeft: 10,
        height: 30,
        borderRadius: 2 
    },
    sendButton : {
        marginLeft: 10,
        background: "#503CF5",
        "&:hover": {
            backgroundColor: "#763BF5"
        }
    }
}));


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Inbox = (props) => {
    console.log(props);
    const classes = styles(props);

    //useRef for the main inputs
    const fromData = useRef(null);
    const textData = useRef(null);
    const subject = useRef(null);

    //state new message
    const [newMessage, setNewMessage] = useState(false);
    const [emails, setEmails] = useState([{}])

    //state alert
    const [sendMessageAlert, setSendMessage] = useState(false)

    /**
     * This function is in charge of calling the back-end API to make the sending
     * of the new message together with the necessary data.
    */
    function sendMessage() {
        axios.post("http://darkemail.me:3000/send", {
            from: fromData.current.value,
            subject: subject.current.value,
            text: textData.current.value,
            to: props.location.state.email
        })
        .then(result => {
            if (result.data.status) {
                setEmails([{
                    from: fromData.current.value,
                    subject: subject.current.value,
                    text: textData.current.value
                }]
            )}
            setNewMessage(false);
            setSendMessage(true);
        })
    }

    /**
     * Message handling
     */
    function _handleClickSend() {
        sendMessage();
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
        setSendMessage(false);
    };

    /**
     * This component is the one that fills up when you want to send a message
     */
    function MessageComponent() {
        if (newMessage) {
            return (
                <Fade in={newMessage}>
                    <div className={classes.sendMessageComponent} style={{width: "-webkit-fill-available", height: "650px"}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField className={classes.mainFields} value={props.location.state.email} id="filled-disabled" disabled label="To" fullWidth />
                            </Grid>
                            <Grid item xs={12} style={{display: "flex"}}>
                                <input placeholder="From" className={classes.from} id="standard-basic" label="From" ref={fromData} />
                                <Button className={classes.sendButton} color="blue" onClick={_handleClickSend}>Enviar</Button>
                            </Grid>
                            <Grid item xs={12}>
                            <input placeholder="Subject" className={classes.subject} id="standard-basic" label="Subject" ref={subject} />
                            </Grid>
                            <Grid item xs={12}>
                                <textarea draggable={"false"} className={classes.textArea} ref={textData} rows={15}/>
                            </Grid>
                            
                        </Grid>
                    </div>
                </Fade>)
        } else {
            return(<div></div>)
        }
    }
    
    return (
        <div className={classes.mainColor} style={{display: "grid"}}>
            <div style={{width: "100%", display: "fixed"}}>
            <Grid container spacing={24} justify="center" alignItems="center" style={{ maxWidth: '100%', height: "80px"}}>
               
                <Avatar className={classes.largeAvatar}>{props.location.state.email[0]}</Avatar>
                <Button variant="outlined" className={classes.buttonMessage} onClick={() => {
                    if (newMessage) {
                        setNewMessage(false);
                    } else {
                        setNewMessage(true);
                    }
                }
                }>New message</Button>
            </Grid>
            </div>
            <div className={classes.boxMessages} style={{height: "100%"}}>
            {
                emails.map( (item) => (
                    <Card>
                        <CardContent>
                            <Typography Typography>From: {item.from}</Typography>
                            <Typography Typography>Subject: {item.subject}</Typography>
                            <Typography Typography>Content: {item.text}</Typography>
                        </CardContent>
                    </Card>
                ))

            }
            </div>
            <MessageComponent message={newMessage}/>
            <Snackbar open={sendMessageAlert} autoHideDuration={3000} onClose={_handleCloseAlert} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert severity="success" onClose={_handleCloseAlert}>
                    Email sent successfully!
                </Alert>
            </Snackbar>
        </div>
    )
}
//Export view
export default Inbox;