const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jwt-simple');
const User = require('./db/User.js');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: 'secret',
};

module.exports = {
  createToken: id => jwt.encode({ id }, opts.secretOrKey),
  strategy: new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.get(jwtPayload.id).getView();
      if (!user) {
        throw new Error('No user found');
      }
      return done(null, user);
    } catch (e) {
      return done('Something wrong', false);
    }
  }),
};
