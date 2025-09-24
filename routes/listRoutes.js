import express from 'express';
import { db } from '../firebase.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// POST route to add an item to the list
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

    res.status(201).json({ message: 'Item added successfully', id: newId, data: newItem });

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

// GET route to fetch all items from the list
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('mylist').get();
    const items = [];
    snapshot.forEach(doc => {
      items.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error getting documents from Firestore:', error);
    res.status(500).json({ error: 'Failed to retrieve items from the database.' });
  }
});

// DELETE route to remove items by name
router.delete('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ error: 'Item name is required.' });
    }

    const querySnapshot = await db.collection('mylist').where('name', '==', name).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'No items found with that name.' });
    }

    // Use a batch to delete all matching documents
    const batch = db.batch();
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.status(200).json({ message: `${querySnapshot.size} item(s) deleted successfully.` });

  } catch (error) {
    console.error('Error deleting documents from Firestore by name:', error);
    res.status(500).json({ error: 'Failed to delete items from the database.' });
  }
});

// DELETE route to remove an item by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // if (!id) {
    //   return res.status(400).json({ error: 'Item ID is required.' });
    // }

    const docRef = db.collection('mylist').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    await docRef.delete();

    res.status(200).json({ message: 'Item deleted successfully.' });

  } catch (error) {
    console.error('Error deleting document from Firestore:', error);
    res.status(500).json({ error: 'Failed to delete item from the database.' });
  }
});

export default router;
