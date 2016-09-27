[![Build Status](https://drone.io/github.com/em/ns-log/status.png)](https://drone.io/github.com/em/ns-log/latest)

# Namespaced Logger

Very simple logger for node and browser.

- Outputs log messages with prefixes
- Globally filter logs by string matching

You can do everything with this.

# Example Usage
```
npm install ns-log
```

```
let log = require('ns-log');
log.enable('[ERROR] [INFO] [WARN]'); // This is just an all-inclusive string match
```

```
let log = require('ns-log').ns('mymodule'); // This just adds 'mymodule' to the beginning of each log line
log.info('Hello');
=> [INFO] my:module 2016-12-1 10:10:10 (UTC) Hello
```

# Log Levels
These are built-in namespaces.

- log.error = log.ns('[ERROR]');
- log.info = log.ns('[INFO]');
- log.warn = log.ns('[WARN]');
- log.debug = log.ns.prefix('[DEBUG]');

```
log.error('error');
log.warn('warn');
log.info('info');
log.debug('debug');
```

# Browser usage 
TODO
