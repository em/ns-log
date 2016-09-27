var expect = require('chai').expect;
var nslog = require('./');

describe('nslog', function() {
  // Last console calls
  var last = {};

  // Hook each console method
  ['log', 'info', 'warn', 'error', 'debug']
  .forEach(function(type) {
    nslog.global.console[type] = function(msg) {
      last[type] = msg;
    }
  });

  // Override timestamp generator
  nslog.global.timestamp = function() {return '(time)'};
  nslog.global.filter = '';

  beforeEach(function() {
    last = {};
  });

  describe('direct call', function() {
    it('outputs with no type-prefix', function() {
      nslog.enable();
      nslog('hello');
      expect(last.log).eql('(time) hello');
    });

    it('does nothing if not enabled', function() {
      nslog.disable();
      nslog('hello');
      expect(last.log).eql(undefined);
    });
  });

  describe('enable', function() {
    it('sets global.filter to [] if undefined', function() {
      nslog.enable();
      expect(nslog.global.filter).eql([]);
    });
    it('sets global.enabled', function() {
      nslog.enable();
      expect(nslog.global.enabled).eql(true);
    });
  });

  describe('ns', function() {
    it('prefixes logs with namespace', function() {
      nslog.enable();
      nslog.ns('yo')('dawg');
      expect(last.log).eq('yo (time) dawg');
    });
  });

  describe('debug', function() {
    it('calls console.debug prefixed with [debug]', function() {
      nslog.enable();
      nslog.debug('yo');
      expect(last.debug).eq('[debug] (time) yo');
    });
  });

  describe('info', function() {
    it('calls console.info prefixed with [info]', function() {
      nslog.enable();
      nslog.info('yo');
      expect(last.info).eq('[info] (time) yo');
    });
  });

  describe('warn', function() {
    it('calls console.warn prefixed with [warn]', function() {
      nslog.enable();
      nslog.warn('yo');
      expect(last.warn).eq('[warn] (time) yo');
    });
  });

  describe('error', function() {
    it('calls console.error prefixed with [error]', function() {
      nslog.enable();
      nslog.error('yo');
      expect(last.error).eq('[error] (time) yo');
    });
  });

  describe('global.filter', function() {
    it('ignores non-matches', function() {
      nslog.enable('notinlog');
      nslog('hello world');
      expect(last.log).eq(undefined);
    });

    it('uses AND logic', function() {
      nslog.enable('hello notinlog');
      nslog('hello world');
      expect(last.log).eq(undefined);
    });

    it('allows matches through', function() {
      nslog.enable('hello');
      nslog('hello world');
      expect(last.log).eq('(time) hello world');
    });
  });
});

