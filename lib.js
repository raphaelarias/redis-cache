// RedisDB Cache

import { MongoInternals } from 'meteor/mongo';
import { redisSet, redisGet, redisDel } from './redis-client';

// Clone MongoInternals.Connection.prototype storing the original functions
const { insert, find, findOne, update, upsert, remove } = { ...MongoInternals.Connection.prototype };

MongoInternals.Connection.prototype.insert = function (collection, document) {
  if (document && document._id) {
    redisSet(document._id, JSON.stringify(document));
  }

  return insert.apply(this, arguments);
};

MongoInternals.Connection.prototype.findOne = function (collection, selector, mod, options) {
  const _id = typeof selector === 'string' ? selector : selector._id;

  if (_id) {
    const redisResult = redisGet(_id);

    if (redisResult) {
      return JSON.parse(redisResult);
    }
  }

  return findOne.apply(this, arguments);
};

MongoInternals.Connection.prototype.remove = function (collection, selector, mod, options) {
  const _id = typeof selector === 'string' ? selector : selector._id;

  if (_id) {
    redisDel(_id);
  }

  return remove.apply(this, arguments);
};
