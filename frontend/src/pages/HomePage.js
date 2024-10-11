import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the new Navbar component
import ProductList from '../components/ProductList';

export default class HomePage extends Component {
  state = {
    isLoggedIn: false,
  };

  render() {
    return (
      <div>
        <Navbar /> {/* Add Navbar component */}
        <h1>Welcome to the E-Commerce Store</h1>
        <ProductList />
      </div>
    );
  }
}
