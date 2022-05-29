const { useTreblle } = require('treblle');
// const express = require('express');
// const app = express();
const trebbleConnect = async (app) => {
  try {
    if (process.env.TREBLLE_APIKEY && process.env.TREBLLE_PROJECTID) {
      useTreblle(app, {
        apiKey: process.env.TREBLLE_APIKEY,
        projectId: process.env.TREBLLE_PROJECTID,
      });
      console.log('Trebble activated');
    } else {
      console.log(
        'No Treblle API Key found, remember to make sure you have a .env file with TREBLLE_APIKEY and TREBLLE_PROJECTID'
      );
      console.log('You can get an API key from https://treblle.com/');
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = trebbleConnect;
