const functions = require('firebase-functions');
const { toUpper, identity, now } = require('lodash');
var md5 = require('md5');

var firebaseConfig = {
    apiKey: "AIzaSyB64pNbCqJSKksiZrEdNLCDwPkyP554HpU",
    authDomain: "onclinic-dd11a.firebaseapp.com",
    databaseURL: "https://onclinic-dd11a.firebaseio.com",
    projectId: "onclinic-dd11a",
    storageBucket: "onclinic-dd11a.appspot.com",
    messagingSenderId: "431443097768",
    appId: "1:431443097768:web:a82ec860e388224d4fea9d",
    measurementId: "G-NEX6MKFZJY"
};

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

firebase.initializeApp(firebaseConfig);
// admin.initializeApp(functions.config().firebase);
// firebase.initializeApp(functions.config().firebase);

var db = firebase.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.paymentStatus = functions.https.onRequest((req, res) => {
    var data = {
        merchant_id: req.body.merchant_id,
        order_id: req.body.order_id,
        payment_id: req.body.payment_id,
        payhere_amount: req.body.payhere_amount,
        payhere_currency: req.body.payhere_currency,
        status_code: req.body.status_code,
        md5sig: req.body.md5sig,
        custom_1: req.body.custom_1,
        custom_2: req.body.custom_2,
        method: req.body.method,
        status_message: req.body.status_message,
    }

    res.send(data)

    console.log("data recieved - ", data);

    var md5signature = (md5(data.merchant_id + data.order_id + data.payhere_amount + data.payhere_currency + data.status_code + (md5("8W8sLebxEd04pAfVn7R6u28ggVsgET0m94DvnimznIfx")).toUpperCase())).toUpperCase()

    if ((data.md5sig === md5signature) && data.status_code === "2") {
        console.log("md5 matched")
        db.collection('Appointments').doc(data.custom_1).update({
            paymentStatus: 'Verified'
        })
            .then(() => {
                console.log("successfully updated appointments MAIN")
                return null;
            })
            .catch(error => {
                console.log(error)
            });

        db.collection('Users').doc(data.custom_2).collection('Appointments').doc(data.custom_1).update({
            paymentStatus: 'Verified'
        })
            .then(() => {
                console.log("successfully updated appointments DOCTOR");
                return null;
            })
            .catch(error => {
                console.log(error)
            });
    }
    console.log(data.md5sig);
    console.log(md5signature);



})
const admin = require('firebase-admin')
const _ = require('lodash');
const { element } = require('protractor');
const { error } = require('console');
var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var sns = new AWS.SNS();
require('dotenv').config()
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);
exports.getLatestPosts =
    functions.https.onRequest(async (req, res) => {
        const now = admin.firestore.Timestamp.now().toDate();
        // var interval = now.setMinutes(now.getMinutes() + 30);
        var interval = new Date(now.getTime() + 30 * 60000);
        // now = new Date(interval);
        // const interval = admin.firestore.Timestamp.now()
        // var interval = new Date(now.getTime() + (30 * 60 * 1000));
        console.log(now) 
        console.log(interval)
        const snapshot = await db
            .collection("Appointments").where('appointmentDate', '>', now).where('status', '==', "Active").where('appointmentDate', '<=', interval)
            .orderBy("appointmentDate", "desc").limit(1)
            .get()
        // console.log(snapshot.docs)
        const data = snapshot.docs.map(doc => doc.data())
        // const subset = _.pick(data, ['Appointments', 'status']);
        // data.forEach(element => console.log(element))
        // var result = Object.entries(data)
        // console.log(result["appointmentDate"]);
        // console.log(result['appointmentDate'])
        // const appointmentdata = data[0]
        // const appointmentDate
        data.forEach(element => {
            // console.log(element['appointmentDate'])
            client.messages
                .create({ body: 'Hi there!', from: '+19036907183', to: '+94713255247' })
                .then(message => console.log(message.sid)).catch(error => console.log(error))
            var name = element['patientName'];
            var doctorName = element['doctorName'];
            var appointmentNo = element['appointmentNo']
            var appointmentTime = element['appointmentTime']
            var phone = element['phone'].substring(1)
            // var params = {
            //     Message: 'Hello '+name+' you have appointment with Dr. '+doctorName+' on today at '+appointmentTime+'   Appointment No: '+appointmentNo,
            //     MessageStructure: 'string',
            //     PhoneNumber: "+94"+phone
            // };
            // console.log()
            // sns.publish(params, function (err, data) {
            //     if (err) console.log(err, err.stack); // an error occurred
            //     else console.log(data);           // successful response
            // });
        })
        res.send(data)
    })

// exports.timer = functions.pubsub.schedule('1 * * * *').onRun((context)=>{
//     const now = admin.firestore.Timestamp.now().toDate();
//     db.doc("Appointments/2020-08-24_d0000001_p0000002_2").update({"testTime":now});
//     // console.log("sdhfbsdhfvsdhv");
//     return console.log('ssss');
// })