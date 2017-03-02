const Mixpanel = require('mixpanel');

const loggingTools = require('auth0-log-extension-tools');
const logTypes = require('../lib/logTypes');
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
      const now = Date.now();
      const mixpanelEvents = logs.map(function (log) {
        const eventName = logTypes[log.type].event;
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
        console.log('Upload complete.');
        return cb();
      });
    };

    const slack = new loggingTools.SlackReporter({ hook: config('SLACK_INCOMING_WEBHOOK_URL') });

    const options = {
      batchSize: config('BATCH_SIZE'),
      logTypes: config('LOG_TYPES'),
      onLogsReceived: sendLogs,
      onSuccess: (config('SLACK_SEND_SUCCESS')) ? slack.send : null,
      onError: slack.send
    };

    const logger = loggingTools.Auth0Logger(req.auth0, storage, options);

    return logger(req, res, next);
  };
