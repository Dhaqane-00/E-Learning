const BunnyStorage = require('bunnycdn-storage').default;
const dotenv = require('dotenv');
dotenv.config();

const bunnyStorage = new BunnyStorage(
  process.env.BUNNY_STORAGE_API_KEY,
  process.env.BUNNY_STORAGE_ZONE_NAME
);

module.exports = bunnyStorage; 