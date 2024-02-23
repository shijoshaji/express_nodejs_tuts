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
