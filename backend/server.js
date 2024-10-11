const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const app = express();

const connectionString = 'mongodb+srv://dbUser:dbUserPassword@crud-app.kurpd.mongodb.net/?retryWrites=true&w=majority&appName=crud-app';
const client = new MongoClient(connectionString);
const databaseName = 'ecommerce';
const collectionName = 'products';
const usersCollectionName = 'users';
const cartCollectionName = 'carts';
const ordersCollectionName = 'orders';

app.use(express.json());

async function startServer() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB.');

    const db = client.db(databaseName);
    const productsCollection = db.collection(collectionName);
    const usersCollection = db.collection(usersCollectionName);
    const cartCollection = db.collection(cartCollectionName);
    const ordersCollection = db.collection(ordersCollectionName);

    app.locals.productsCollection = productsCollection;
    app.locals.usersCollection = usersCollection;
    app.locals.cartCollection = cartCollection;
    app.locals.ordersCollection = ordersCollection;


    app.use('/api/products', productRoutes(productsCollection));
    app.use('/api/users', userRoutes);
    app.use('/api/cart', cartRoutes);
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    app.listen(5000, () => {
      console.log('Server is running on http://localhost:5000');
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

startServer();
