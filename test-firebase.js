
import { db } from './firebase.js';

async function testConnection() {
  console.log('Attempting to connect to Firestore...');
  try {
    const docRef = db.collection('mylist').doc('ayc0WvIQuCvT19UQugZR');
    await docRef.set({
      message: 'Successfully connected to Firestore!',
      timestamp: new Date()
    });
    console.log('Success! A document has been written to the "test-connection" collection.');
    const doc = await docRef.get();
    if (doc.exists) {
      console.log('Document data:', doc.data());
    } else {
        console.log('Document was written, but could not be read back.');
    }
  } catch (error) {
    console.error('Failed to connect to Firestore. Please check your service account credentials.');
    console.error('Error details:', error.message);
  }
}

testConnection();
