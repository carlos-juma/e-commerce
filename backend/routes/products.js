const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (collection) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const products = await collection.find({}).toArray();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching products', error: err });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const productId = new ObjectId(req.params.id);
      const product = await collection.findOne({ _id: productId });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching product', error: err });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const newProduct = req.body;
      const result = await collection.insertOne(newProduct);
      res.status(201).json(result.ops[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error adding product', error: err });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const productId = new ObjectId(req.params.id);
      const updatedProduct = req.body;
      const result = await collection.updateOne({ _id: productId }, { $set: updatedProduct });
      if (result.matchedCount === 0) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating product', error: err });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const productId = new ObjectId(req.params.id);
      const result = await collection.deleteOne({ _id: productId });
      if (result.deletedCount === 0) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting product', error: err });
    }
  });

  return router;
};
