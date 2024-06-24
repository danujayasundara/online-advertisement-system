const bcrypt = require('bcrypt');
const saltRounds = 10;

const plainPassword = 'seller02'; 
bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Hashed Password:', hashedPassword);
  }
});