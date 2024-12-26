const User = require('../models/User');

//There is no signup option so make it one default user
const createDefaultUser = async () => {
  try {
    const defaultUser = {
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    };

    const existingUser = await User.findOne({ email: defaultUser.email });
    if (!existingUser) {
      await User.create(defaultUser);
      console.log('Default admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

module.exports = createDefaultUser;