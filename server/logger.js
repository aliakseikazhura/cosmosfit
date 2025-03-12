const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp(), // adds a timestamp property
      format.splat(),
      format.simple()
      // winston.format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "app.log" }),
      ]
});

module.exports = logger