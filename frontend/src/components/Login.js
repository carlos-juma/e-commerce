import React, { Component } from 'react';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
    } else {
      alert(data.message);
    }
  };

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="username" placeholder="Username" onChange={this.handleInputChange} />
          <input type="password" name="password" placeholder="Password" onChange={this.handleInputChange} />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}
