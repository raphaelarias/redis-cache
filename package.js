// Redis cache

Package.describe({
  name: 'raphaelarias:redis-cache',
  summary: 'Blazing fast cache using RedisDB',
  git: '',
  version: '0.0.1',
});

Npm.depends({
  redis: '2.8.0',
});

Package.onUse((api) => {
  api.use([
    'mongo',
    'ecmascript',
    'underscore',
    'lai:collection-extensions@0.2.1_1',
    'matb33:collection-hooks@0.8.1',
  ], 'server');

  api.addFiles([
    'redis-client.js',
    'redis-config.js',
    'lib.js',
  ], 'server');
});
