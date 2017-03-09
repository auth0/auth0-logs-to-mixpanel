const router = require('express').Router;

const config = require('../lib/config');
const processLogs = require('../lib/processLogs');
const htmlRoute  = require('./html');

module.exports = (storage) => {
  const app = router();

  app.get('/', processLogs(storage), htmlRoute());

  app.get('/api/report', (req, res, next) =>
    storage.read()
      .then(data => res.json((data && data.logs) || []))
      .catch(next));

  return app;
};
