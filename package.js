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
  ], 'server');

  api.addFiles([
    'redis-client.js',
    'redis-config.js',
    'lib.js',
  ], 'server');
});
