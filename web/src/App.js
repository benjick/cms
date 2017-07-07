import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Login from './Login';

class App extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="App">
        {user.loggedIn ? 'Welcome back' : <Login />}
        <p>
          Counter:
          <span className={user.isOdd ? 'user-odd' : 'user-even'}> {user.count} </span>
        </p>
        <p>
          <button onClick={() => user.increment()}> + </button>
          <button onClick={() => user.decrement()}> - </button>
        </p>
      </div>
    );
  }
}

export default inject('user')(observer(App));
