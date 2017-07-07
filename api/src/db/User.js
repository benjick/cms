const thinky = require('thinky')();
const bcrypt = require('bcrypt-nodejs');

const type = thinky.type;
const error = new Error('Invalid credentials');

// Create a model - the table is automatically created
const User = thinky.createModel('User', {
  id: type.string(),
  password: type.string(),
  email: type.string(),
});

User.ensureIndex('email');

User.defineStatic('getUser', function getUser() {
  return this.without('password');
});

// check that we don't have duplicate users
User.pre('save', async function userPreSave(next) {
  if (this.id && this.id !== '') {
    // this is an update
    next();
    return;
  }
  if (this.password.length < 5) {
    next(new Error('Too short password'));
  } else {
    this.password = bcrypt.hashSync(this.password);
    next();
  }
  const email = await User.getAll(this.email, { index: 'email' });
  if (email.length > 0) {
    next(new Error('Email already exists'));
  }
  next();
});

User.defineStatic('login', async function login(email, password) {
  let user;
  try {
    user = await this.getAll(email, { index: 'email' }).nth(0);
  } catch (e) {
    throw error;
  }
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    throw error;
  }
  return user.id;
});

User.defineStatic('getView', function getView() {
  return this.without('password');
});

// User.login('max@malm.me', 'asd123')
//   .then(res => console.log(res))
//   .catch(e => console.log('catch login', e.message));

// const test = new User({
//   email: 'max@malm.me',
//   password: 'asd123',
// });
// test.saveAll()
//   .then(res => console.log('then', res))
//   .catch(res => console.log('catch', res.message));

module.exports = User;
