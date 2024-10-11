import React, { Component } from 'react';

export default class Profile extends Component {
  state = {
    username: '',
    orders: [],
  };

  componentDidMount() {
    this.fetchUserProfile();
  }

  // Fetch user profile and order history from the server
  fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to view your profile.');
      return;
    }

    const response = await fetch('/api/users/profile', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });

    if (response.ok) {
      const data = await response.json();
      this.setState({
        username: data.username,
        orders: data.orders,
      });
    } else {
      alert('Failed to retrieve profile data.');
    }
  };

  render() {
    const { username, orders } = this.state;

    return (
      <div>
        <h2>User Profile</h2>
        <p>Username: {username}</p>
        <h3>Order History</h3>
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <ul>
            {orders.map((order, index) => (
              <li key={index}>
                <span>Order #{index + 1} - {order.items.length} items - Total: ${order.total.toFixed(2)}</span>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
