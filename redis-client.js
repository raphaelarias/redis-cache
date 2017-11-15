// Redis client

import redis from 'redis';
import config from './redis-config';

const settings = Meteor.settings;

// Get settings from package: cultofcoders:redis-oplog
const redisSettings = settings.redisOplog || settings.redis || {};
const options = { ...config.redis, ...redisSettings };

// Set array to store cached collections
if (settings.redis) {
  Meteor.settings.redis.cachedCollections = [];
} else {
  Meteor.settings.redis = { cachedCollections: [] };
}

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
const redisCommands = {
  set: Meteor.wrapAsync(redisInstance.set, redisInstance),
  get: Meteor.wrapAsync(redisInstance.get, redisInstance),
  del: Meteor.wrapAsync(redisInstance.del, redisInstance),
};

export function exec(command, _id, document) {
  try {
    if (settings.redis.debug) {
      console.log(`Executing command "${command}" on Redis, document _id: ${_id}"`);
    }

    if (command === 'set') {
      return redisCommands[command](_id, JSON.stringify(document), 'EX', options.EX);
    }

    return redisCommands[command](_id);
  } catch (error) {
    console.error(`Error executing command "${command}" on Redis, document _id: ${_id}: ${error}`);
  }

  return null;
}
