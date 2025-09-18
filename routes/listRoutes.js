import express from 'express';
import { db } from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// The POST route to add items to Firestore, now at the root of this router
router.post('/', async (req, res) => {
  try {
    const { name, genre, type } = req.body;

    if (!name || !genre || !Array.isArray(genre) || !type) {
      return res.status(400).json({ 
        error: 'Invalid payload. Required fields are: name (string), genre (array of strings), and type (string).' 
      });
    }

    const newId = uuidv4();
    const docRef = db.collection('mylist').doc(newId);

    const newItem = {
      name,
      genre,
      type,
    };

    await docRef.set(newItem);

    res.status(201).json({ message: 'Item added successfully', data: newItem });

  } catch (error) {
    console.error('Error adding document to Firestore:', error);
    
    if (error.code === 7 /* PERMISSION_DENIED */) {
      return res.status(500).json({ 
        error: 'Permission denied. Could not write to Firestore. Please check your service account key and Firestore security rules.' 
      });
    }
    
    res.status(500).json({ error: 'Failed to add item to the database.' });
  }
});

export default router;
