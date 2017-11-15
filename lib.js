// RedisDB Cache

import { MongoInternals } from 'meteor/mongo';
import { exec } from './redis-client';

// Clone MongoInternals.Connection.prototype storing the original functions
const { find, findOne } = { ...MongoInternals.Connection.prototype };

CollectionExtensions.addPrototype('cacheOnRedis', function (keys) {
  const Collection = this;
  const collectionName = this._name;

  // Store the name of the cached collections
  Meteor.settings.redis.cachedCollections.push(collectionName);

  // AFTER INSERT
  Collection.after.insert((userId, doc) => {
    exec('set', `${collectionName}_${doc._id}`, JSON.stringify(doc));
  });

  // AFTER UPDATE
  Collection.after.update((userId, doc) => {
    exec('set', `${collectionName}_${doc._id}`, JSON.stringify(doc));
  }, { fetchPrevious: false });

  // AFTER UPSERT
  Collection.after.upsert((userId, doc) => {
    exec('set', `${collectionName}_${doc._id}`, JSON.stringify(doc));
  }, { fetchPrevious: false });

  // AFTER REMOVE
  Collection.after.remove((userId, doc) => {
    exec('del', `${collectionName}_${doc}`._id);
  });
});

MongoInternals.Connection.prototype.findOne = function (collectionName, selector) {
  const _id = typeof selector === 'string' ? selector : selector._id;

  if (_id) {
    const redisResult = exec('get', `${collectionName}_${_id}`);

    if (redisResult) {
      return JSON.parse(redisResult);
    }
  }

  return findOne.apply(this, arguments);
};
