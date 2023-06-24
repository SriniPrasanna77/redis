const redis = require('redis');
const schemaFieldTypes = require('redis').SchemaFieldTypes;
// import {AggregateSteps, AggregateGroupByReducers, createClient, SchemaFieldTypes} from 'redis';


const client = redis.createClient()
    .on('error', err => {
        console.log('Redis Client Error', err);
    });

const redisClient = async () => {
    await client.connect();
    console.log('client connected');
    return client;
};

const createUserIndex = async (rc) => {
    try {
        await rc.ft.create('idx:users', {
            '$.name': {
                type: schemaFieldTypes.TEXT,
                SORTABLE: true
            },
            '$.city': {
                type: schemaFieldTypes.TEXT,
                AS: 'city'
            },
            '$.age': {
                type: schemaFieldTypes.NUMERIC,
                AS: 'age'
            }
        }, { ON: 'JSON', PREFIX: 'user' });
    } catch (e) {
        if (e.message === 'Index already exists') {
            console.log('Index exists already, skipped creation.');
        } else {
            // Something went wrong, perhaps RediSearch isn't installed...
            console.error(e);
            process.exit(1);
        }
    }
};

const addUsers = async (rc) => {
    await Promise.all([
        rc.json.set('user:1', '$', {
            "name": "Paul John",
            "email": "paul.john@example.com",
            "age": 42,
            "city": "London"
        }),
        rc.json.set('user:2', '$', {
            "name": "Eden Zamir",
            "email": "eden.zamir@example.com",
            "age": 29,
            "city": "Tel Aviv"
        }),
        rc.json.set('user:3', '$', {
            "name": "Paul Zamir",
            "email": "paul.zamir@example.com",
            "age": 35,
            "city": "Tel Aviv"
        }),
    ]);
};

const searchUser = async (rc) => {
    let result = await rc.ft.search(
        'idx:users',
        'London @age:[30 45]'
    );
    console.log(JSON.stringify(result, null, 2));
}

redisClient().then((rc) => {
    console.log('inside promise call then');
    rc.get('name').then((val) => { console.log(val); });
    createUserIndex(rc).then(() => {
        addUsers(rc).then(() => {
            searchUser(rc);
        })
    })
})

