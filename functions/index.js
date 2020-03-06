const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./directory-3368e-firebase-adminsdk-qrixg-e8b501e080.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://directory-3368e.firebaseio.com"
});


const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.companyClicks = functions.https.onCall((data, context) => {
    return db
            .collection('building')
            .doc(data.building_id)
            .collection('companies')
            .doc(data.company_id)
            .update({clicks:  admin.firestore.FieldValue.increment(1)})
})

exports.companySearched = functions.https.onCall((data, context) => {
    return db
            .collection('building')
            .doc(data.building_id)
            .collection('companies')
            .doc(data.company_id)
            .update({searched_amount:  admin.firestore.FieldValue.increment(1)})
})
