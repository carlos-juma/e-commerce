const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Middleware to verify JWT token and extract user ID
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Authorization token required' });

  // Decode JWT to get user ID
  try {
    const payload = jwt.verify(token, 'secretkey');
    req.userId = payload.id; // Set user ID for use in other routes
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// POST: Checkout the cart and create an order
router.post('/checkout', verifyToken, async (req, res) => {
    try {
      const cart = await req.app.locals.cartCollection.findOne({ userId: req.userId });
      if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
  
      const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      // Create an order
      await req.app.locals.ordersCollection.insertOne({
        userId: req.userId,
        items: cart.items,
        total,
        date: new Date(),
      });
  
      // Clear the cart after checkout
      await req.app.locals.cartCollection.updateOne({ userId: req.userId }, { $set: { items: [] } });
  
      res.json({ message: 'Checkout successful, order placed!' });
    } catch (err) {
      res.status(500).json({ message: 'Error during checkout', error: err });
    }
  });
  

// GET: Retrieve items in the user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const userCart = await req.app.locals.cartCollection.findOne({ userId: req.userId });
    if (!userCart) return res.json({ items: [], total: 0 });

    const total = userCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: userCart.items, total });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cart', error: err });
  }
});

// POST: Add a new item to the user's cart
router.post('/', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await req.app.locals.productsCollection.findOne({ _id: new ObjectId(productId) });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await req.app.locals.cartCollection.findOne({ userId: req.userId });
    if (!cart) {
      // Create new cart if it doesn't exist
      await req.app.locals.cartCollection.insertOne({
        userId: req.userId,
        items: [{ ...product, quantity }],
      });
    } else {
      // Update existing cart
      const existingItem = cart.items.find((item) => item._id.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ ...product, quantity });
      }

      await req.app.locals.cartCollection.updateOne(
        { userId: req.userId },
        { $set: { items: cart.items } }
      );
    }

    res.json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product to cart', error: err });
  }
});

// DELETE: Remove an item from the user's cart
router.delete('/:productId', verifyToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await req.app.locals.cartCollection.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const updatedItems = cart.items.filter((item) => item._id.toString() !== productId);
    await req.app.locals.cartCollection.updateOne(
      { userId: req.userId },
      { $set: { items: updatedItems } }
    );

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item from cart', error: err });
  }
});

module.exports = router;
