const axios = require('axios');
const sha256 = require('sha256');
const express = require('express');
const app = express();

// Payload for refund   

const payload = {
  merchantId: "PGTESTPAYUAT86",
  merchantUserId: "MUID123",
  merchantTransactionId: "T2408051204327065106046",
  originalTransactionId: "6406015607234021508042T",
  amount: 500,
  callbackUrl: "https://beta.instacollabs.com/callback"
};

// Encode payload to base64
const encode = Buffer.from(JSON.stringify(payload)).toString('base64');

// Salt key and index
const saltKey = '96434309-7796-489d-8924-ab56988a6076';
const saltIndex = 1;

// Generate X-VERIFY header for refund
const finalXHeader = sha256(encode + '/pg/v1/refund' + saltKey) + '###' + saltIndex;

console.log('X-VERIFY Header for Refund:', finalXHeader);

// Perform refund request
const refund = async () => {
  try {
    const response = await axios.post(
      'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/refund',
      { request: encode },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'X-VERIFY': finalXHeader
        }
      }
    );

    console.log('Refund response:', response.data);
  } catch (error) {
    console.error('Refund error:', error.response ? error.response.data : error.message);
  }
};

// Generate X-VERIFY header for status
const string = '/pg/v1/status/' + payload.merchantId + '/' + payload.merchantTransactionId + saltKey;
const sha256Value = sha256(string);
const finalXHeaderStatus = sha256Value + '###' + saltIndex;

console.log('X-VERIFY Header for Status:', finalXHeaderStatus);

// Perform status check request
const checkStatus = async () => {
  try {
    const response = await axios.get(
      `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${payload.merchantId}/${payload.merchantTransactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'X-VERIFY': finalXHeaderStatus,
          'X-MERCHANT-ID': payload.merchantId
        }
      }
    );

    console.log('Status check response:', response.data);
  } catch (error) {
    console.error('Status check error:', error.response ? error.response.data : error.message);
  }
};

app.listen(3000, () => {
  console.log("Listening on port 3000");
  refund().then(() => checkStatus());
});
