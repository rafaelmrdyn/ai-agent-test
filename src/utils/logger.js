const { EventEmitter } = require('events');

class Logger extends EventEmitter {
  constructor() {
    super();
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };
    
    return JSON.stringify(logEntry);
  }

  shouldLog(level) {
    return this.logLevels[level] <= this.logLevels[this.logLevel];
  }

  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) return;
    
    const formattedMessage = this.formatMessage(level, message, meta);
    console.log(formattedMessage);
    
    this.emit('log', { level, message, meta, timestamp: new Date().toISOString() });
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  // Specialized logging methods
  logRequest(req, res, responseTime) {
    this.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  }

  logError(error, context = {}) {
    this.error('Application Error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  logDatabaseQuery(sql, params, duration) {
    this.debug('Database Query', {
      sql,
      params,
      duration: `${duration}ms`
    });
  }

  logBusinessLogic(operation, data, result) {
    this.info('Business Logic', {
      operation,
      data,
      result
    });
  }
}

const logger = new Logger();

module.exports = logger;
