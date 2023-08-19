var admin = require("firebase-admin");
var uid = process.argv[2];

var serviceAccount = require('./angular-dashboard-63dc8-firebase-adminsdk-hjdv0-caa31c2f9a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angular-dashboard-63dc8-default-rtdb.firebaseio.com",
});

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("custom claims set for user", uid);
    process.exit();
  });
