const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const sha256 = require("sha256");
const uniqid = require("uniqid");
const path = require("path");


const app = express();

// UAT environment
const MERCHANT_ID = "PGTESTPAYUAT86";
const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const SALT_INDEX = 1;
const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const APP_BE_URL = "https://beta.instacollabs.com/payment"; 


app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use((req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split('.')[0];
  req.subdomain = subdomain;
  next();
});



app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




app.get('/payment' , (req , res) =>{
  res.render('index');
} )


// Endpoint to initiate a payment
app.get("/pay", async function (req, res, next) {
  const amount = 10;
  const userId = "MUID123";
  const merchantTransactionId = uniqid();  // Generating a unique transaction ID

  const normalPayLoad = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: userId,
    amount: amount * 100,
    redirectUrl: `${APP_BE_URL}/payment/validate/${merchantTransactionId}`,
    redirectMode: "IFRAME",  
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

  try {
    const response = await axios.post(
      `${PHONE_PE_HOST_URL}/pg/v1/pay`,
      { request: base64EncodedPayload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    );

    if (response.data.success) {
      res.json({ url: response.data.data.instrumentResponse.redirectInfo.url });
    } else {
      res.status(500).json({ error: response.data.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Endpoint to check the status of payment
app.get("/payment/validate/:merchantTransactionId", async function (req, res) {
  const { merchantTransactionId } = req.params;
  if (merchantTransactionId) {
    let statusUrl = `${PHONE_PE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;

    let string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}${SALT_KEY}`;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

    try {
      const response = await axios.get(statusUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          "X-MERCHANT-ID": MERCHANT_ID,
          accept: "application/json",
        },
      });

      if (response.data && response.data.code === "PAYMENT_SUCCESS") {
        res.send(response.data);
      } else {
        res.send(response.data);
      }
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("Sorry!! Error");
  }
});

// Endpoint to initiate a refund
app.post("/refund", async function (req, res) {
  const { originalTransactionId, refundAmount, callbackUrl } = req.body;
  const userId = "User123";
  const merchantTransactionId = "Anuj123";

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

  try {
    const response = await axios.post(
      `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/refund`,
      { request: base64EncodedPayload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    );

    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`PhonePe application listening on port ${port}`);
});
