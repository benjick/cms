import { extendObservable, computed } from 'mobx';
import axios from 'axios';

const storage = '@CmsApp/LoginToken';

const api = axios.create({
  baseURL: 'http://localhost:3001/',
  timeout: 1000,
});

const ok = status => !(status > 299 || status < 200);

class User {
  constructor() {
    const token = localStorage.getItem(storage);
    if (token) {
      api.defaults.headers.common.Authorization = `JWT ${token}`;
      this.testCredentials();
    }
    extendObservable(this, {
      count: 0,
      isOdd: computed(() => this.count % 2 === 1),
      token: token || null,
      loggedIn: computed(() => !!this.token),
    });
  }

  testCredentials() {
    api.get('prot')
    .then((response) => {
      if (!ok(response.status)) {
        this.token = null;
      }
    })
    .catch((error) => {
      if (!ok(error.response.status)) {
        this.token = null;
      }
    });
  }

  login(email, password) {
    axios.post('http://localhost:3001/login', {
      email, password,
    })
    .then((response) => {
      this.token = response.data.token;
      api.defaults.headers.common.Authorization = `JWT ${response.data.token}`;
      localStorage.setItem(storage, response.data.token);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }
}

export default new User();
