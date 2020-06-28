/**
 * This file contains the endpoint and functions for sending Emai according to the status of the suppliers
 */
//Import  dependences
const express = require('express');
const router = express.Router();
const axios = require('axios');
const nodemailer = require("nodemailer");
//sendGrid agent
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//MailGun agent
var mailgun = require('mailgun-js')({apiKey: process.env.API_KEY_MailGun , domain: process.env.DOMAIN_MainGun});


/**
 * Send messagee specific to email with the provider sendGrid
 *
 * @param {string} toEmail E-mail to send
 * @param {string} fromEmail E-mail address that will send the message 
 * @param {string} subject Subject of the E-mail
 * @param {string} text content of the message
 * @returns promise 
 */
function sendEmailSendGrid(toEmail, fromEmail, subject, text) {
    const msg = {
        to: toEmail,
        from: fromEmail,
        subject: subject,
        text: text
    };
    return (sgMail.send(msg));
}

/**
 * Send  email with provider MailGun
 * 
 * @param {string} toEmail Email to send
 * @param {string} subject Subject of the email
 * @param {string} text content of the message
 * @returns {string} Return the error in case of the error
 */
function sendEmailMailGun(toEmail, subject, text) {
    

    const data = {
        from: 'DarkEmail me@' + process.env.DOMAIN_MainGun,
        to: toEmail,
        subject: subject,
        text: text
    };

    mailgun.messages().send(data, (error, body) => {
        if (error) {
            return(error)
        }
    });
}


/** 
 * @description This endpoint post is in charge of controlling the provider to redirect the sending of the email
 * @param {string} From E-mail address to send the message
 * @param {string} To E-mail address that will send the message 
 * @param {string} Text Content of the message
 * @param {string} Subject Suject of the message
 * @returns {JSON} Response {"status":"ok"} if all that sucess
 */
router.post("/", function (req, res) {
    const toEmail = req.body.from;
    const subject = req.body.subject;
    const text = req.body.text;
    const fromEmail = req.body.to;

    axios.get("http://localhost:4000/status")
        .then(async function  (result) {
            const integrityProviders = result.data;
            if (integrityProviders.sendGrid === 'ok') {
                const responseEmail = await sendEmailSendGrid(toEmail, fromEmail, subject, text);
                console.log(responseEmail)
            } else {
                console.log(sendEmailMailGun(toEmail, subject, text));
            }                                               
            res.send(JSON.stringify({"status" : "ok"}));
        })
        .catch(err => {
            res.send(JSON.stringify({"error" : err}));
        })
    
})

module.exports = router;