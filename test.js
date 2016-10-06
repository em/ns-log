var expect = require('chai').expect;
var nslog = require('./');

describe('nslog', function() {
  // Last console calls
  var last = {};

  // Hook each console method
  ['log', 'info', 'warn', 'error', 'debug']
  .forEach(function(type) {
    nslog.global.console[type] = function() {
      last[type] = [].slice.call(arguments).join(' ');
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
      expect(last.log).eql('hello');
    });

    it('does nothing if not enabled', function() {
      nslog.disable();
      nslog('hello');
      expect(last.log).eql(undefined);
    });
  });

  describe('enable', function() {
    it('defaults to "*" if undefined', function() {
      nslog.enable();
      expect(nslog.global.filter).eql(["*"]);
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
      expect(last.log).eq('yo dawg');
    });
  });

  describe('debug', function() {
    it('calls console.debug prefixed with [debug]', function() {
      nslog.enable();
      nslog.debug('yo');
      expect(last.debug).eq('[debug] yo');
    });
  });

  describe('info', function() {
    it('calls console.info prefixed with [info]', function() {
      nslog.enable();
      nslog.info('yo');
      expect(last.info).eq('[info] yo');
    });
  });

  describe('warn', function() {
    it('calls console.warn prefixed with [warn]', function() {
      nslog.enable();
      nslog.warn('yo');
      expect(last.warn).eq('[warn] yo');
    });
  });

  describe('error', function() {
    it('calls console.error prefixed with [error]', function() {
      nslog.enable();
      nslog.error('yo');
      expect(last.error).eq('[error] yo');
    });
  });

  describe('global.filter', function() {
    it('ignores non-matches', function() {
      nslog.enable('notinlog');
      nslog('hello world');
      expect(last.log).eq(undefined);
    });

    it('allows matches through', function() {
      nslog.enable('yo');
      nslog.ns('yo')('dawg');
      expect(last.log).eq('yo dawg');
    });

    it('uses OR logic', function() {
      nslog.enable('yo orthis');
      nslog.ns('yo')('dawg');
      expect(last.log).eq('yo dawg');
    });


  });
});

