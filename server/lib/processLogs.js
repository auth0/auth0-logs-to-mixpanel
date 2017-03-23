const Mixpanel = require('mixpanel');

const loggingTools = require('auth0-log-extension-tools');
const config = require('../lib/config');

module.exports = (storage) =>
  (req, res, next) => {
    if (!req.body || !req.body.schedule || req.body.state !== 'active') {
      return next();
    }

    const Logger = Mixpanel.init(config('MIXPANEL_TOKEN'), {
      key: config('MIXPANEL_KEY')
    });

    const sendLogs = (logs, cb) => {
      if (!logs || !logs.length) {
        cb();
      }

      Logger.import_batch(logs, function(errorList) {
        if (errorList && errorList.length > 0) {
          if (logs.length > 10) {
            const currentBatch = logs.splice(0, 10);

            return Logger.import_batch(currentBatch, function(errors) {
              if (errors && errors.length > 0) {
                console.log('Errors occurred sending logs to Mixpanel:', errorList);
                return cb(errorList);
              }

              console.log(`${currentBatch.length} events successfully sent to mixpanel.`);
              return sendLogs(logs, cb);
            });
          }

          console.log('Errors occurred sending logs to Mixpanel:', errorList);

          return cb(errorList);
        }

        console.log(`${logs.length} events successfully sent to mixpanel.`);
        return cb();
      });
    };

    const onLogsReceived = (logs, cb) => {
      if (!logs || !logs.length) {
        return cb();
      }

      const now = Date.now();
      const mixpanelEvents = logs.map(function (log) {
        const eventName = loggingTools.logTypes[log.type].event;
        log.time = now;
        log.distinct_id = 'auth0-logs';

        return {
          event: eventName,
          properties: log
        };
      });

      sendLogs(mixpanelEvents, cb);
    };

    const slack = new loggingTools.SlackReporter({ hook: config('SLACK_INCOMING_WEBHOOK_URL') });

    const options = {
      domain: config('AUTH0_DOMAIN'),
      clientId: config('AUTH0_CLIENT_ID'),
      clientSecret: config('AUTH0_CLIENT_SECRET'),
      batchSize: config('BATCH_SIZE'),
      startFrom: config('START_FROM'),
      logTypes: config('LOG_TYPES'),
      logLevel: config('LOG_LEVEL'),
      onLogsReceived: onLogsReceived,
      onSuccess: (config('SLACK_SEND_SUCCESS')) ? slack.send : null,
      onError: slack.send
    };

    const logger = loggingTools.Auth0Logger(storage, options);

    return logger(req, res, next);
  };
