const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Hashed password for "${password}":`, hash);
}

hashPassword('12345678'); // Replace 'password123' with your test password
