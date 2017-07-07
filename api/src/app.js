const express = require('express');
const passport = require('passport');
const { strategy, createToken } = require('./auth');
const bodyParser = require('body-parser');

const User = require('./db/User.js');

const app = express();

var cors = require('cors')

app.use(cors())
app.use(bodyParser.json());
passport.use(strategy);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = await User.login(email, password);
    const token = createToken(userId);
    res.json({
      token, userId,
    });
  } catch (e) {
    res.status(401).send('bye');
  }
});

app.get('/prot', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('userId:', req.user.id);
  res.send('U R PROTECTED');
});

app.get('/api/v1/:user/:string', (req, res) => {
  const json = {
    items: [
      {
        key: 'test',
        html: '<strong>superman</strong>',
      },
    ],
  };
  if (req.headers.host === 'localhost:3000') {
    setTimeout(() => {
      res.json(json);
    }, Math.round(Math.random() * 1000 * 2));
  } else {
    res.json(json);
  }
});

const port = 3001;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
