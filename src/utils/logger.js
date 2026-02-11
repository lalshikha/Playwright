/**
 * @file Logger module for consistent and color-coded output
 * @description Provides logging utilities with timestamps and color coding
 */

const colors = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m'
};

/**
 * Logger class for color-coded and timestamped logging
 */
class Logger {
  /**
   * Get current timestamp
   * @returns {string} Formatted timestamp
   */
  getTimestamp() {
    const now = new Date();
    return `${now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })}`;
  }

  /**
   * Format log message with timestamp
   * @param {string} level - Log level (INFO, PASS, WARN, ERROR, DEBUG)
   * @param {string} message - Log message
   * @param {string} color - Color code
   * @returns {void}
   */
  log(level, message, color) {
    const timestamp = this.getTimestamp();
    const formattedMessage = `${color}[${timestamp}] [${level}] ${message}${colors.RESET}`;
    console.log(formattedMessage);
  }

  /**
   * Log info message
   * @param {string} message - Message to log
   * @returns {void}
   */
  info(message) {
    this.log('INFO', message, colors.CYAN);
  }

  /**
   * Log success/pass message
   * @param {string} message - Message to log
   * @returns {void}
   */
  pass(message) {
    this.log('PASS', message, colors.GREEN);
  }

  /**
   * Log warning message
   * @param {string} message - Message to log
   * @returns {void}
   */
  warn(message) {
    this.log('WARN', message, colors.YELLOW);
  }

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {Error|null} error - Optional error object
   * @returns {void}
   */
  error(message, error = null) {
    this.log('ERROR', message, colors.RED);
    if (error) {
      console.error(colors.RED, error.stack || error.message, colors.RESET);
    }
  }

  /**
   * Log debug message
   * @param {string} message - Message to log
   * @returns {void}
   */
  debug(message) {
    this.log('DEBUG', message, colors.MAGENTA);
  }

  /**
   * Log section header
   * @param {string} section - Section name
   * @returns {void}
   */
  section(section) {
    const line = '='.repeat(50);
    console.log(`\n${colors.BRIGHT}${colors.BLUE}${line}${colors.RESET}`);
    console.log(`${colors.BRIGHT}${colors.BLUE}${section}${colors.RESET}`);
    console.log(`${colors.BRIGHT}${colors.BLUE}${line}${colors.RESET}\n`);
  }
}

module.exports = new Logger();
