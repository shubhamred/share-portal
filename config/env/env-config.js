require('dotenv').config();

const { API_HOST, DOMAIN, CLIENT_ID, AUDIENCE, ASSET_URL } = process.env;

module.exports = { API_HOST, DOMAIN, CLIENT_ID, AUDIENCE, ASSET_URL };
