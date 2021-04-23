const { compare, hash } = require("bcryptjs");

module.exports = {
  generateHash: async (payload) => hash(payload, 8),
  compareHash: async (payload, hashed) => compare(payload, hashed),
};
