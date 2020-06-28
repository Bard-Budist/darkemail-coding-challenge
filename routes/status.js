/**
 * This file provives the status endpoint for check if le firts provider is alive
 *
 * Pending task:
 *  add way to check if a API is alive
 *
 */

//Import dependences
const express = require('express');
const axios = require('axios');

//Instance Route for the endpoint
const router = express.Router();

/**
 * @description check status for the firts provider
 * @returns return the result for that api
 */
function handleFirtsProviders() {
    return(axios.get("https://3tgl2vf85cht.statuspage.io/api/v2/status.json"));
}

/**
 * @description the function for the get method is return the status of diferrent povider
 * When the status of the SendGrid API in 'major' or 'critical' i deside down for  request  for new emails
 * @returns Return a JSON for the status  the that rovider
 */
router.get('/', async function(req, res){
    const data = await handleFirtsProviders();
    const status = data.data.status.indicator;
    let provider = {};
    if (status == 'major' || status == 'critical') {
        provider.sendGrid = "down";
    } else {
        provider.sendGrid = "ok";
    }
    provider.MailGun = "ok"
    res.send(JSON.stringify(provider));
});


//export this router to use in our index.js
module.exports = router;