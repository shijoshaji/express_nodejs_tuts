import passport from 'passport';
import { Strategy } from 'passport-local';
import { mockUserCredentials } from '../utils/shared/usersList.js';
import { userModel } from '../utils/mongoose/schemas/user.schema.js';
import { Error } from 'mongoose';
import { comparePWD, hashPassword } from '../utils/helpers.js';

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser', id);
  try {
    // const finduser = mockUserCredentials.find((user) => user.id === id);
    const finduser = await userModel.findById(id);
    if (!finduser) throw new Error('User not found');
    done(null, finduser);
  } catch (error) {
    done(error, null);
  }
});
export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log('CREDENTIALS', username, password);
    try {
      // const findUser = mockUserCredentials.find(
      //   (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
      // );

      // Above commented since we are using real users from DB
      const findUser = await userModel.findOne({ username });
      if (!findUser) throw new Error('Login: User Not Found');
      if (!comparePWD(password, findUser.password)) throw new Error('Login: BAD CRED');
      delete findUser.password;
      done(null, findUser);
    } catch (err) {
      console.log('ERR:', err);
      done(err, null);
    }
  })
);
