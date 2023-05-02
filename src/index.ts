import express, { Application } from 'express';
import router from './Routes/routes';
import mongoose from 'mongoose';

//add .env later.
const MONGODB_URI = 'mongodb://localhost:27017/GwentUsers';
const port = 3000;
const app: Application = express();
const bodyParser = require('body-parser');

// Add middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

mongoose
  .connect(MONGODB_URI)
  .then(()=>{
    console.log("Connected to MongoDB");
  })
  .catch((err) =>{
    console.error(err);
  });