/**
 * This file controls the login and creation of the users with AWS Cognito, it also creates the 
 * SendGrid sender, which sends a verification to your e-mail so that you can send these.
 */

//Import dependences
const express = require('express');
require('cross-fetch/polyfill');
var AmazonCognito = require('amazon-cognito-identity-js');
const axios = require('axios');
var CognitoUserPool = AmazonCognito.CognitoUserPool;
var AuthenticationDetails = AmazonCognito.AuthenticationDetails;
var CognitoUser = AmazonCognito.CognitoUser;

//Router instance
const router = express.Router();

/**
 * Pooluser with env variable
 */
const poolClients = {
    UserPoolId: process.env.ID_POOL,
    ClientId: process.env.CLIENT_ID
  };
  
/**
 * Pooruser with the var poolClients
 */
const Pooluser = new CognitoUserPool(poolClients);

/**
 * @description This function creates a new sender within the SendGrid API to enable email sending
 * @param {object} data This object contains all the data necessary to create a sender
 *  String nickname,
 *  String email,
 *  String name,
 *  String address,
 *  String city,
 *  String country
 */
function createUserProviderSendGrid(data) {
  const body = {
    nickname: data.nickname,
    from: {
      email: data.email,
      name: data.name
    },
    reply_to: {
      email: "devbardbudist@hotmail.com",
      name: "admin"
    },
    address: data.address,
    city: data.city,
    country: data.country
  };

  axios({
    method: 'post',
    url: 'https://api.sendgrid.com/v3/marketing/senders',
    data: JSON.stringify(body),
    headers: {
      Authorization: 'Bearer ' + process.env.SENDGRID_API_KEY
    }
  }).then(result => {
    console.log(result.data);
    return("ok")
  }).catch(err => {
    console.log(err);
    return("err");
  })



}

/** 
 * This endpoint create a new user in AWS Cognito and also create the user as a sender in SendGrid
 * Response with a JSON {"status": "ok"} if everything went well.
 * */ 
router.post("/create", async function(req, res) {
    var attributeList = [];

    const email = req.body.email;
    const password = req.body.password;
    attributeList.push(new AmazonCognito.CognitoUserAttribute({Name:"email",Value:email}));
    await Pooluser.signUp(email, password, attributeList, null, (err, data) => {
        if (err) {
            if (err.code === 'InvalidPasswordException') {
                res.send(JSON.stringify({"status" : "the password must be longer than 8 characters along with symbols and numbers"}))
            } else if (err.code === 'UsernameExistsException') {
                res.send(JSON.stringify({"status" : err.message}))
            }
        } else {
            res.send(JSON.stringify({"status":"ok"}))
        }
    });
    //Call function to create sender
    createUserProviderSendGrid(req.body);
})

/** 
 * This endpoint controls the login, if successful it returns a JSON {"status": "ok"}, 
 * otherwise the JSON about the related error.
*/
router.post("/login", function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const user = new CognitoUser({
        Username: email,
        Pool: Pooluser
      });
    const auth = new AuthenticationDetails({
        Username: email,
        Password: password
    });

    user.authenticateUser(auth, {
        onSuccess: data => {
          res.send(JSON.stringify({"status": "ok"}))
        },
        onFailure: err => {
          res.send(JSON.stringify({"status": err.message}))
        }
      });
})
//export router
module.exports = router;