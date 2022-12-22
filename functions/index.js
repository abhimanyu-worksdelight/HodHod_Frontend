const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const https = require('https');
const querystring = require('querystring');

const entityId =  '8ac7a4c77d044303017d04cb381801a6'
const accessToken = 'OGFjN2E0Yzc3ZDA0NDMwMzAxN2QwNGNhYzAwMjAxYTJ8ZFJNOFA4N2F3Uw=='

exports.getCheckoutId = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const { data: { amount } } = req.body
        
        const request = async () => {
            const path = '/v1/checkouts';
            const data = querystring.stringify({
                'entityId': entityId,
                'amount': amount,
                'currency': 'SAR',
                'paymentType': 'DB'
            });
            const options = {
                port: 443,
                host: 'test.oppwa.com',
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': data.length,
                    'Authorization': `Bearer ${accessToken}`
                }
            };
            return new Promise((resolve, reject) => {
                const postRequest = https.request(options, function (res) {
                    const buf = [];
                    res.on('data', chunk => {
                        buf.push(Buffer.from(chunk));
                    });
                    res.on('end', () => {
                        const jsonString = Buffer.concat(buf).toString('utf8');
                        try {
                            resolve(JSON.parse(jsonString));
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
                postRequest.on('error', reject);
                postRequest.write(data);
                postRequest.end();
            });
        };

        request().then((response) => {
            res.status(200).send(
                { 
                    data: { 
                        message: 'Success' ,
                        ...response
                    },
                }
            );
        }).catch((error) => {
            res.status(500).send(
                { 
                    data: { 
                        message: 'Error' ,
                        ...error
                    },
                }
            );
        });
    })
});

const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteUser = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {

        res.set('Access-Control-Allow-Origin', '*');
        console.log("req.body['data']", req.body['data']);

        const uid = req.body['data'];
        
        if(uid){
            admin.auth()
            .deleteUser(uid)
            .then(() => {
                console.log('Successfully deleted user');
                res.status(200).send({data: {'message': 'User deleted'}});
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
                res.status(200).send({data: {'message': 'Unable to delete user.'}});
            });
        }
            
    })
});

exports.disableUser = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {

        res.set('Access-Control-Allow-Origin', '*');
        console.log("req.body['data']", req.body['data']);

        const uid = req.body['data'];
        
        if(uid){
            admin
            .auth()
            .updateUser(uid, {
                disabled: true,
            })
            .then((userRecord) => {
                console.log('Successfully updated user', userRecord.toJSON());
                res.status(200).send({data: {'message': 'User deleted'}});
            })
            .catch((error) => {
                console.log('Error updating user:', error);
                res.status(500).send({data: {'message': 'Unable to disable user.'}});
            });
        }
            
    })
});

exports.enableUser = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {

        res.set('Access-Control-Allow-Origin', '*');
        console.log("req.body['data']", req.body['data']);

        const uid = req.body['data'];
        
        if(uid){
            admin
            .auth()
            .updateUser(uid, {
                disabled: false,
            })
            .then((userRecord) => {
                console.log('Successfully updated user', userRecord.toJSON());
                res.status(200).send({data: {'message': 'User deleted'}});
            })
            .catch((error) => {
                console.log('Error updating user:', error);
                res.status(500).send({data: {'message': 'Unable to enable user.'}});
            });
        }
            
    })
});

exports.disableMultipleUser = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {

        res.set('Access-Control-Allow-Origin', '*');
        console.log("req.body['data']", req.body['data']);

        const uid = req.body['data'];
        
        if(uid){
            admin
            .auth()
            .updateUser(uid, {
                disabled: true,
            })
            .then((userRecord) => {
                console.log('Successfully updated user', userRecord.toJSON());
                res.status(200).send({data: {'message': 'User deleted'}});
            })
            .catch((error) => {
                console.log('Error updating user:', error);
                res.status(500).send({data: {'message': 'Unable to disable user.'}});
            });
        }
            
    })
});