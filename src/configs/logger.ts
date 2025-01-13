import winston from "winston";

const customFormat = winston.format.combine(
  winston.format.timestamp(), // Add timestamps
  winston.format.printf(({ level, message, timestamp }) => {
    const leftPart = `\x1b[32m[${level.toUpperCase()}]\x1b[0m`;
    const rightPart = `\x1b[37m${message}\x1b[0m`;
    return `${leftPart} ${rightPart}`;
  })
);

export const logger = winston.createLogger({
  level: "debug", // Log level
  format: customFormat, // Log message format
  transports: [
    new winston.transports.Console(), // Log to the console
  ],
});
