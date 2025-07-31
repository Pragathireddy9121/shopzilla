const bcrypt = require('bcryptjs');

const hashPassword = async () => {
  const plainPassword = 'chotu4674';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainPassword, salt);
  console.log('Hashed password:', hashed);
};

hashPassword();