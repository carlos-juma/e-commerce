import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Cart extends Component {
  state = {
    cartItems: [],
    total: 0,
  };

  componentDidMount() {
    this.fetchCartItems();
  }

  // Fetch cart items from the backend with authorization token
  fetchCartItems = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    if (!token) {
      alert('You must be logged in to view the cart.');
      return;
    }

    const response = await fetch('/api/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (response.ok) {
      const data = await response.json();
      this.setState({
        cartItems: data.items,
        total: data.total,
      });
    } else {
      alert('Failed to retrieve cart items. Please make sure you are logged in.');
      console.error('Error:', response.status, response.statusText);
    }
  };

  render() {
    const { cartItems, total } = this.state;

    return (
      <div>
        <h1>Your Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div>
            <p>Your cart is empty.</p>
            <Link to="/">Go Back to Shopping</Link>
          </div>
        ) : (
          <div>
            <ul>
              {cartItems.map((item) => (
                <li key={item._id}>
                  <span>{item.name} - ${item.price} x {item.quantity}</span>
                </li>
              ))}
            </ul>
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
        )}
      </div>
    );
  }
}
