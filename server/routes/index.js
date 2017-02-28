const router = require('express').Router;
const middlewares = require('auth0-extension-express-tools').middlewares;

const config = require('../lib/config');
const processLogs = require('../lib/processLogs');
const htmlRoute  = require('./html');

module.exports = (storage) => {
  const app = router();

  const managementApiClient = middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  });

  app.get('/', managementApiClient, processLogs(storage), htmlRoute());

  app.get('/api/report', (req, res, next) =>
    storage.read()
      .then(data => res.json(data))
      .catch(next));

  return app;
};
