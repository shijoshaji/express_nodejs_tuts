import passport from 'passport';
import { Strategy } from 'passport-local';
import { mockUserCredentials } from '../utils/shared/usersList.js';

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser', id);
  try {
    const finduser = mockUserCredentials.find((user) => user.id === id);
    if (!finduser) throw new Error('User not found');
    done(null, finduser);
  } catch (error) {
    done(error, null);
  }
});
export default passport.use(
  new Strategy((username, password, done) => {
    console.log('CREDENTIALS', username, password);
    try {
      const findUser = mockUserCredentials.find(
        (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
      );
      if (!findUser) throw new Error('Wrong Credentials');
      delete findUser.password;
      done(null, findUser);
    } catch (err) {
      console.log('ERR:', err);
      done(err, null);
    }
  })
);
