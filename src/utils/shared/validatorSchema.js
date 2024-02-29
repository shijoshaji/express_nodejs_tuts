export const createUserValidator = {
  location: {
    isLength: { options: { min: 3, max: 3 }, errorMessage: 'Location code must be 3 characters' },
    notEmpty: {
      errorMessage: 'location must not be empty',
    },
    isString: {
      errorMessage: 'location must be String',
    },
  },
  name: {
    notEmpty: {
      errorMessage: 'name must not be empty',
    },
    isString: {
      errorMessage: 'name must be String',
    },
  },
};

export const creatDBUserValidator = {
  username: {
    isLength: { options: { min: 3, max: 10 }, errorMessage: 'username code must be 3 characters' },
    notEmpty: {
      errorMessage: 'username must not be empty',
    },
    isString: {
      errorMessage: 'username must be String',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'password must not be empty',
    },
    isLength: { options: { min: 3, max: 10 }, errorMessage: 'password code must be 3 - 10 characters' },
  },
};
