const Mixpanel = require('mixpanel');

const loggingTools = require('auth0-log-extension-tools');
const config = require('../lib/config');
const logger = require('../lib/logger');

module.exports = (storage) =>
  (req, res, next) => {
    const wtBody = (req.webtaskContext && req.webtaskContext.body) || req.body || {};
    const isCron = (wtBody.schedule && wtBody.state === 'active');

    if (!isCron) {
      return next();
    }

    const normalizeErrors = errors => {
      return errors.map(err => ({ name: err.name, message: err.message, stack: err.stack }))
    };

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
                logger.error(errors);
                return cb(normalizeErrors(errors));
              }

              logger.info(`${currentBatch.length} events successfully sent to mixpanel.`);
              return sendLogs(logs, cb);
            });
          }

          logger.error(errorList);

          return cb(normalizeErrors(errorList));
        }

        logger.info(`${logs.length} events successfully sent to mixpanel.`);
        return cb();
      });
    };

    const onLogsReceived = (logs, cb) => {
      if (!logs || !logs.length) {
        return cb();
      }

      logger.info(`${logs.length} logs received.`);

      const now = Date.now();
      const mixpanelEvents = logs.map((log) => {
        const eventName = loggingTools.logTypes.get(log.type);
        log.time = now;
        log.distinct_id = log.user_id || log.user_name || log.client_id || log._id;

        return {
          event: eventName,
          properties: log
        };
      });

      sendLogs(mixpanelEvents, cb);
    };

    const slack = new loggingTools.reporters.SlackReporter({ hook: config('SLACK_INCOMING_WEBHOOK_URL'), username: 'auth0-logs-to-mixpanel', title: 'Logs To Mixpanel' });

    const options = {
      domain: config('AUTH0_DOMAIN'),
      clientId: config('AUTH0_CLIENT_ID'),
      clientSecret: config('AUTH0_CLIENT_SECRET'),
      batchSize: config('BATCH_SIZE'),
      startFrom: config('START_FROM'),
      logTypes: config('LOG_TYPES'),
      logLevel: config('LOG_LEVEL')
    };

    const auth0logger = new loggingTools.LogsProcessor(storage, options);

    return auth0logger
      .run(onLogsReceived)
      .then(result => {
        slack.send(result.status, result.checkpoint);
        res.json(result);
      })
      .catch(err => {
        slack.send({ error: err, logsProcessed: 0 }, null);
        next(err);
      });
  };
