import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

class Login extends Component {
  state = {
    email: '',
    password: '',
  }

  login(e) {
    e.preventDefault();
    this.props.user.login(this.state.email, this.state.password);
  }

  render() {
    return (
      <form onSubmit={e => this.login(e)}>
        <input
          type="text"
          placeholder="E-mail"
          value={this.state.email}
          onChange={e => this.setState({ email: e.currentTarget.value })}
        />
        <input
          type="text"
          placeholder="Password"
          value={this.state.password}
          onChange={e => this.setState({ password: e.currentTarget.value })}
        />
        <button type="submit">Login</button>
      </form>
    );
  }
}

export default inject('user')(observer(Login));
