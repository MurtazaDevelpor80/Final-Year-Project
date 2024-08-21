import admin from "firebase-admin";

const serviceAccount = "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { admin };
