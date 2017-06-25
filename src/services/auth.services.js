import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import User from '../modules/users/user.model';
import constants from '../config/constants';

const localOpts = {
  usernameField: 'email', // this is because of the way passport is set up
};

// Local Strategy
const localStrategy = new LocalStrategy(localOpts, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    console.log(email, password);
    console.log('-------------------');
    console.log(user);

    // we are seeing if an email has been stored in DB to authorize access
    if (!user) {
      // if there is no user email in DB they can't log in
      return done(null, false);
    } else if (!user.authenticateUser(password)) { // if the typed password is not the user's password, they cant log in
      return done(null, false);
    }

    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

// JWT Strategy

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader('authorization'),
  secretOrKey: constants.JWT_SECRET,
};
// Payload is the data coming from the JWT
const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    // We are using ID because we are going to place the user's ID in the payload
    const user = await User.findById(payload._id);

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(localStrategy);
passport.use(jwtStrategy);

// Authentication middlewares
export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });

