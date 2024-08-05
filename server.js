// Importing modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const sha256 = require("sha256");
const uniqid = require("uniqid");

// Creating express application
const app = express();

// UAT environment
const MERCHANT_ID = "PGTESTPAYUAT86";
const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const SALT_INDEX = 1;
const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const APP_BE_URL = "http://localhost:3002"; // Our application

// Setting up middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Endpoint to initiate a payment
app.get("/pay", async function (req, res, next) {
  const amount = +req.query.amount;
  const userId = "MUID123";
  const merchantTransactionId = "Anuj123";

  const normalPayLoad = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: userId,
    amount: amount * 100,
    redirectUrl: `${APP_BE_URL}/payment/validate/${merchantTransactionId}`,
    redirectMode: "REDIRECT",
    callbackUrl: APP_BE_URL,
    mobileNumber: "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
  const base64EncodedPayload = bufferObj.toString("base64");

  const string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
  const sha256_val = sha256(string);
  const xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

  axios
    .post(
      `${PHONE_PE_HOST_URL}/pg/v1/pay`,
      { request: base64EncodedPayload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    )
    .then(function (response) {
      console.log("response->", JSON.stringify(response.data));
      res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
    })
    .catch(function (error) {
      res.send(error);
    });
});

// Endpoint to check the status of payment
app.get("/payment/validate/:merchantTransactionId", async function (req, res) {
  const { merchantTransactionId } = req.params;
  if (merchantTransactionId) {
    let statusUrl = `${PHONE_PE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;

    let string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}${SALT_KEY}`;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

    axios
      .get(statusUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          "X-MERCHANT-ID": MERCHANT_ID,
          accept: "application/json",
        },
      })
      .then(function (response) {
        console.log("response->", response.data);
        if (response.data && response.data.code === "PAYMENT_SUCCESS") {
          // Redirect to FE payment success status page
          res.send(response.data);
        } else {
          // Redirect to FE payment failure / pending status page
          res.send(response.data);
        }
      })
      .catch(function (error) {
        // Redirect to FE payment failure / pending status page
        res.send(error);
      });
  } else {
    res.send("Sorry!! Error");
  }
});

// Endpoint to initiate a refund
app.post("/refund", async function (req, res) {
  const { originalTransactionId, refundAmount, callbackUrl } = req.body;
  const userId = "User123"; // Replace with actual userId if needed
  const merchantTransactionId = "Anuj123"; // Generate a unique transaction ID for the refund

  // Create the payload for the refund request
  const refundPayload = {
    merchantId: MERCHANT_ID,
    merchantUserId: userId,
    originalTransactionId: originalTransactionId,
    merchantTransactionId: merchantTransactionId,
    amount: refundAmount,
    callbackUrl: callbackUrl,
  };

  const bufferObj = Buffer.from(JSON.stringify(refundPayload), "utf8");
  const base64EncodedPayload = bufferObj.toString("base64");

  const string = base64EncodedPayload + "/pg/v1/refund" + SALT_KEY;
  const sha256_val = sha256(string);
  const xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

  axios
    .post(
      `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/refund`,
      { request: base64EncodedPayload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    )
    .then(function (response) {
      console.log("Refund response->", response.data);
      res.send(response.data);
    })
    .catch(function (error) {
      console.error("Refund error->", error);
      res.status(500).send(error);
    });
});

// Example request payload for initiating a refund
// {
//   "originalTransactionId": "OD620471739210623",
//   "refundAmount": 1000,
//   "callbackUrl": "https://webhook.site/callback-url"
// }

app.get("/", (req, res) => {
  res.send("PhonePe Integration APIs!");
});

// Starting the server
const port = 3002;
app.listen(port, () => {
  console.log(`PhonePe application listening on port ${port}`);
});
