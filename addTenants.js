const { getRedisClient } = require('./getRedisClient');
const fs = require('fs');
const parse = require('csv-parse');

var parser = parse.parse({columns: true}, function (err, records) {
	console.log(records);
    console.log('records output');
});

fs.createReadStream('data/tenant_sample_data.csv').pipe(parser);