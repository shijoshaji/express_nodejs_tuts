import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = (pwd) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  console.log('SALT', salt);
  return bcrypt.hashSync(pwd, salt);
};

export const comparePWD = (plainPWD, hashedPWD) => bcrypt.compareSync(plainPWD, hashedPWD);
