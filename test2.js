const axios = require('axios');
const crypto = require('crypto');

// Load environment variables
const SALT_KEY = '96434309-7796-489d-8924-ab56988a6076';
const SALT_INDEX = '1';

async function phonePeRefundAPI(tra_id, amount = 100) {
    const payload = {
        merchantId: 'PGTESTPAYUAT86',
        merchantUserId: 'MUID123',
        merchantTransactionId: tra_id,
        originalTransactionId: tra_id.split('').reverse().join(''),
        amount: amount * 100,
        callbackUrl: 'https://beta.instacollabs.com/callback' // Replace with your actual callback URL
    };

    const encode = Buffer.from(JSON.stringify(payload)).toString('base64');
    const string = encode + '/pg/v1/refund' + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const finalXHeader = sha256 + '###' + SALT_INDEX;

    try {
        console.log('Payload:', payload);
        console.log('Encoded Payload:', encode);
        console.log('X-VERIFY Header:', finalXHeader);

        // Initiate refund
        const refundResponse = await axios.post(
            'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/refund',
            JSON.stringify({ request: encode }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': finalXHeader
                }
            }
        );

        const rData = refundResponse.data;
        console.log('Refund Response:', rData);

    //     // Check refund status
    //     const statusString = '/pg/v1/status/PGTESTPAYUAT86/' + tra_id + SALT_KEY;
    //     const statusSha256 = crypto.createHash('sha256').update(statusString).digest('hex');
    //     const statusFinalXHeader = statusSha256 + '###' + SALT_INDEX;

    //     const statusResponse = await axios.get(
    //         'https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/status/MERCHANTUAT/' + tra_id,
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'accept': 'application/json',
    //                 'X-VERIFY': statusFinalXHeader,
    //                 'X-MERCHANT-ID': tra_id
    //             }
    //         }
    //     );

    //     const statusData = statusResponse.data;
    //     console.log('Refund Status Response:', statusData);

    //     return {
    //         refundResponse: rData,
    //         refundStatusResponse: statusData
    //     };

    } catch (error) {
        console.error('Error during PhonePe refund:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Example usage
phonePeRefundAPI('T2408051237247405106985')
    .then(response => {
        console.log('Refund process completed:', response);
    })
    .catch(error => {
        console.error('Refund process failed:', error);
    });
