import admin from 'firebase-admin';
import { createRequire } from 'module';

// Workaround for importing JSON in ES modules
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myproject-1573113567285-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
