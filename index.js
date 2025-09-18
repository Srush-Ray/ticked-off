import express from 'express';
import listRoutes from './routes/listRoutes.js'; // Import the new router

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});

// Mount the list-related routes under the /add path
// Note: The route inside listRoutes.js is '/', which corresponds to /add here
app.use('/add', listRoutes);

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
