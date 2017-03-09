const Mixpanel = require('mixpanel');

const loggingTools = require('auth0-log-extension-tools');
const config = require('../lib/config');

module.exports = (storage) =>
  (req, res, next) => {
    const isScheduled = req.webtaskContext && req.webtaskContext.body && req.webtaskContext.body.schedule && req.webtaskContext.body.state == 'active';
    if (!isScheduled) {
      return next();
    }

    const Logger = Mixpanel.init(config('MIXPANEL_TOKEN'), {
      key: config('MIXPANEL_KEY')
    });

    const sendLogs = (logs, cb) => {
      if (!logs || !logs.length) {
        cb();
      }

      const now = Date.now();
      const mixpanelEvents = logs.map(function (log) {
        const eventName = loggingTools.logTypes[log.type].event;
        // TODO - consider setting the time to date in the underlying log file?
        // log.time = log.date;
        log.time = now;
        log.distinct_id = 'auth0-logs';
        return {
          event: eventName,
          properties: log
        };
      });

      Logger.import_batch(mixpanelEvents, function(errorList) {
        if (errorList && errorList.length > 0) {
          console.log('Errors occurred sending logs to Mixpanel:', JSON.stringify(errorList));
          return cb(errorList);
        }
        console.log(`${mixpanelEvents.length} events successfully sent to mixpanel.`);
        return cb();
      });
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
      onLogsReceived: sendLogs,
      onSuccess: (config('SLACK_SEND_SUCCESS')) ? slack.send : null,
      onError: slack.send
    };

    const logger = loggingTools.Auth0Logger(storage, options);

    return logger(req, res, next);
  };
