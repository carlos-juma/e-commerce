import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '../withRouter';

class ProductDetail extends Component {
  state = {
    product: null,
  };

  componentDidMount() {
    const { id } = this.props.router.params;
    fetch(`/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => this.setState({ product: data }));
  }

  // Function to handle adding the product to the cart
  addToCart = async () => {
    const { product } = this.state;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to add items to your cart.');
      return;
    }

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ productId: product._id, quantity: 1 }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Product added to cart successfully!');
    } else {
      alert(data.message || 'Failed to add product to cart.');
    }
  };

  render() {
    const product = this.state.product;
    if (!product) return <div>Loading...</div>;

    return (
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <button onClick={this.addToCart}>Add to Cart</button>
        <br />
        <Link to="/cart">Go to Cart</Link>
      </div>
    );
  }
}

export default withRouter(ProductDetail);
