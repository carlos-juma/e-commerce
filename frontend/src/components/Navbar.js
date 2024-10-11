import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  state = {
    isLoggedIn: false,
    username: '',
  };

  componentDidMount() {
    this.checkUserLoggedIn();
  }

  // Check user login status and update state
  checkUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username'); // Store username separately
      this.setState({ isLoggedIn: true, username: username || 'User' });
    }
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.setState({ isLoggedIn: false, username: '' });
  };

  render() {
    const { isLoggedIn, username } = this.state;

    return (
      <nav>
        <h2>E-Commerce Store</h2>
        <div>
          {isLoggedIn ? (
            <>
              <span>Welcome, {username}!</span>
              <button onClick={this.handleLogout}>Logout</button>
              <Link to="/profile">
                <button>Profile</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button>Login</button>
              </Link>
              <Link to="/register">
                <button>Register</button>
              </Link>
            </>
          )}
          <Link to="/">
            <button>Home</button>
          </Link>
          <Link to="/cart">
            <button>Cart</button>
          </Link>
        </div>
      </nav>
    );
  }
}
