const functions = require("firebase-functions");
const https = require('https');
const querystring = require('querystring');
const requestClient = require('request');

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });





exports.processPayment = functions.https.onRequest(async (req, res) => {
    const path = '/v1/payments';
    const data = querystring.stringify({
        'entityId': '8ac7a4c77d044303017d04cb381801a6',
        'amount': '92.00',
        'currency': 'SAR',
        'paymentBrand': 'VISA',
        'paymentType': 'DB',
        'card.number': '4111111111111111',
        'card.expiryMonth': '05',
        'card.expiryYear': '2024',
        'card.holder': 'Abhimanyu'
    });

    const options = {
        port: 443,
        host: 'test.oppwa.com',
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
            'Authorization': 'Bearer OGFjN2E0Yzc3ZDA0NDMwMzAxN2QwNGNhYzAwMjAxYTJ8ZFJNOFA4N2F3Uw=='

        }
    };

    try {
        const response = await new Promise((resolve, reject) => {
            const postRequest = https.request(options, function (res) {
                const buf = [];
                res.on('data', chunk => {
                    buf.push(Buffer.from(chunk));
                });
                res.on('end', () => {
                    const jsonString = Buffer.concat(buf).toString('utf8');
                    try {
                        console.log("payment Response ", JSON.parse(jsonString));
                        resolve(JSON.parse(jsonString));
                        res.status(200).send({ data: { 'payment': JSON.parse(jsonString) } });
                    } catch (error) {
                        console.log("payment error ", error);
                        reject(error);
                    }
                });
            });
            postRequest.on('error', reject);
            postRequest.write(data);
            postRequest.end();
        });
        res.json(response);
    } catch (error) {
        console.log("payment Response  catch block ..", error);
        res.status(500).send(error.message);
    }
});

// request().then(console.log).catch(console.error);

// exports.makePayment = functions.https.onRequest((req, res) => {
//     cors(req, res, async () => {

//         res.set('Access-Control-Allow-Origin', '*');
//         console.log("req.body['data']", req.body['data']);

//         const uid = req.body['data'];

//         if (uid) {
//             admin
//                 .auth()
//                 .updateUser(uid, {
//                     disabled: true,
//                 })
//                 .then((userRecord) => {
//                     console.log('Successfully updated user', userRecord.toJSON());
//                     res.status(200).send({ data: { 'message': 'User deleted' } });
//                 })
//                 .catch((error) => {
//                     console.log('Error updating user:', error);
//                     res.status(500).send({ data: { 'message': 'Unable to disable user.' } });
//                 });
//         }

//     })
// });