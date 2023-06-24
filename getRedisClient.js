const redis = require('redis');
// import {AggregateSteps, AggregateGroupByReducers, createClient, SchemaFieldTypes} from 'redis';

const getRedisClient = async () => {
    const client = redis.createClient()
    .on('error', err => {
        console.log('Redis Client Error', err);
    });
    
    await client.connect();
    console.log('client connected');
    return client;
};

exports.getRedisClient = getRedisClient;