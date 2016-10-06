/**
 * @fileOverview
 *
 * The simplest logger ever.
 *
 * 1. Prefixes log messages with strings.
 * 2. Filters output by matching strings.
 *
 * Example usage:
 *
 *  // Make a log function with my:module prefix
 *  var log = require('log').ns('api/login');
 *
 *  // Only output logs containing "module=main" or "ERROR"
 *  log.enable('ERROR');
 *
 *  // log.error logs messages with [ERROR] prefix
 *  log.error('omgbbq');
 *  => '[ERROR] api/login omgbbq'
 */

/**
 * Globals exposed through log.global
 * in every namespaced logger.
 */
var global = {};

/**
 * Disabled by default
 */
global.enabled = false;

/**
 * No filter by default.
 * (everything gets outputed)
 */
global.filter = [];

/**
 * Make a virtual `console` object with
 * all methods available. Falling back
 * gracefully to whatever is available.
 *
 * This also offers us a common interface
 * to test the library by stubbing.
 */
var noop = function() {};
global.console = {};
global.console.log = console && console.log ? console.log.bind(console) : noop;
global.console.error = console && console.error ? console.error.bind(console) : global.console.log;
global.console.warn = console && console.warn ? console.warn.bind(console) : global.console.log;
global.console.info = console && console.info ? console.info.bind(console) : global.console.log;
global.console.debug = console && console.debug ? console.debug.bind(console) : global.console.log;

/**
 * Timestamp generator function. 
 * The initial log() we export will
 * start out with this prefix.
 */
global.timestamp = function() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();

  return year+'-'+month+'-'+day+'T'+hour+':'+min+':'+sec+'Z';
}

/**
 * Generate a log function that appends
 * a prefix to all messages.
 *
 * @param {String} prefix
 *
 * Example:
 *    log.prefix('module')('Hello');
 *    => 'module Hello'
 */
var makeLogFn = function(prefixes) {

  var log = function() {
    log.process(arguments);
  };

  log.error = function() {
    log.process(arguments, 'error');
  };

  log.warn = function() {
    log.process(arguments, 'warn');
  };

  log.info = function() {
    log.process(arguments, 'info');
  };

  log.debug = function() {
    log.process(arguments, 'debug');
  };

  /**
   * Generate another new log function
   * with an additional prefix(es).
   *
   * @param {String...} prefixes
   */
  log.ns = function() {
    return makeLogFn(
      [].slice.call(arguments).concat(prefixes)
    )
  }

  /**
   * Enable logging and optionally
   * set a filter for what gets logged.
   *
   * The filter is applied using AND logic
   * i.e. ALL keywords must match for a
   * message to get logged.
   *
   * @param {String} filter Space-separated keywords
   */
  log.enable = function(filter) {
    global.enabled = true;
    filter = filter || '*';
    filter = filter.split(/\s+/); // Pre-split it
    global.filter = filter;
  }

  /**
   * Disable all logging.
   */
  log.disable = function() {
    global.enabled = false;
  }

  /**
   * Process arguments and return
   * a string to output.
   *
   * @param {Array} args Array of arguments to log
   * @param {String} type (log|error|warn|info|debug) 
   */
  log.process = function(args, type) {
    if (!global.enabled) return;

    // Get writer function based on type
    var writefn = global.console[type] || global.console.log;

    // Convert Arguments to Array
    args = [].slice.call(args);

    // Prepend all prefixes
    args = prefixes.concat(args);

    // Prepend type
    if (type) {
      args = ['['+type+']'].concat(args);
    }

    // Run any functions in args
    // for generated messages
    args = args.map(function(a) {
      if(typeof a === 'function') {
        return a();
      }
      return a;
    });

    // Determine if message matches filter.
    for (var i=0, l = global.filter.length; i<l; ++i) {
      var f = global.filter[i];
      if (args.indexOf(f) !== -1 || f === '*') {
        // Output log message 
        writefn.apply(null, args);
        break;
      }
    }

    // Do nothing
  }

  /**
   * Expose module globals to each
   * log function.
   */
  log.global = global;

  
  return log;
}

/**
 * Export root log function 
 */
module.exports = makeLogFn([]);
