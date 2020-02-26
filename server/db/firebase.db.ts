import admin from 'firebase-admin';

import { firebaseCert } from '../../private';

admin.initializeApp({
  credential: admin.credential.cert(firebaseCert as any),
  databaseURL: "https://my-first-firebase-projec-30d45.firebaseio.com"
});

export const fireStore = admin.firestore();
