
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; 

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error("Hashing failed: " + error.message);
  }
}

async function comparePassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error("Comparing failed: " + error.message);
  }
}

module.exports = {
  hashPassword,
  comparePassword,
};
