import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ProductList extends Component {
  state = {
    products: [],
  };

  componentDidMount() {
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => this.setState({ products: data }));
  }

  render() {
    return (
      <div>
        <h1>Product List</h1>
        <ul>
          {this.state.products.map((product) => (
            <li key={product._id}>
              <Link to={`/product/${product._id}`}>{product.name}</Link> - ${product.price}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
