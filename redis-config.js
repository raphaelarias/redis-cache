// In-Memory configuration storage

const config = {
  debug: false,
  redis: {
    port: 6379,
    host: '127.0.0.1',
    EX: 604800, // One week expiration
  },
};

export default config;
