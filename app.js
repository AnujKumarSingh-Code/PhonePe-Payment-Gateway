const express = require('express');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const cors = require('cors');
const { appendFile } = require('fs');
const sha256 = require('sha256')
const app = express()
const uniqid = require('uniqid');
require('dotenv').config();

const PHONE_PE_HOST_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
const MERCHANT_ID = 'PGTESTPAYUAT';
const SALT_KEY = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const SALT_INDEX = 1;


app.get('/pay' , (req, res) => {
    const payEndPoint = '/pg/v1/pay';
    const merchantTransactionId = uniqid();
    const userId = 123;

    const payload = {
        "merchantId": MERCHANT_ID,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": userId,
        "amount": 10000,
        "redirectUrl": `https://beta.instacollabs.com/redirect-url/${merchantTransactionId}`,
        "redirectMode": "REDIRECT",
        "callbackUrl": "https://beta.instacollabs.com/",
        "mobileNumber": "9999999999",
        "paymentInstrument": {
          "type": "PAY_PAGE"
        }
    }

    
    const bufferObj = Buffer.from(JSON.stringify(payload) , "utf8").toString("base64");
    const xVerify = sha256(bufferObj + payEndPoint + SALT_KEY) + "###" + SALT_INDEX;
                    
    const options = {
        method: 'POST',
        url: `${PHONE_PE_HOST_URL}/${payEndPoint}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify,
        },
        data: {
            request : bufferObj
        }
    };


    axios.request(options)
        .then(function (response){
            console.log(response.data)
            res.send(response.data)
        })
        .catch(function(error){
            console.error(error);
        })
})


app.listen(3000 , (req,res) => {
    console.log("servig port 3000")
})

