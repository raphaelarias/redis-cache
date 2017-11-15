// Redis client

import redis from 'redis';
import config from './redis-config';

const settings = Meteor.settings;

// Get settings from package: cultofcoders:redis-oplog
const redisSettings = settings.redisOplog || settings.redis;
const options = { ...config.redis, ...redisSettings };

export function createRedisClient() {
  const client = redis.createClient(options);

  client.on('error', (error) => {
    console.error('Error while establishing connection to your Redis Server');
    console.error('Options used: ', options);
    console.error('Error: ', error);
  });

  return client;
}

const redisInstance = createRedisClient();
const set = Meteor.wrapAsync(redisInstance.set, redisInstance);
const get = Meteor.wrapAsync(redisInstance.get, redisInstance);
const del = Meteor.wrapAsync(redisInstance.del, redisInstance);

export function redisSet(_id, document) {
  return set(_id, JSON.stringify(document), 'EX', options.EX || 604800); // One week expiration
}

export function redisGet(_id) {
  return get(_id);
}

export function redisDel(_id) {
  return del(_id);
}
