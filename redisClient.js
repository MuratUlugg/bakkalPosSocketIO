var config = require('./configRedis');
//Redis
var redis = require('redis');
const clientABranch = redis.createClient(config.redisConfAcompany); //creates a new client
// const clientBBranch = redis.createClient(config.redisConfBcompany); //creates a new client

//Redis Connect
clientABranch.on('connect', function () {
    console.log('Redis A Şubesi client bağlandı');
});

clientABranch.on('error', function (err) {
    console.log('Redis A Şubesi Clientda bir hata var ' + err);
});

//Redis Connect
// clientBBranch.on('connect', function () {
//     console.log('Redis B Şubesi client bağlandı');
// });

// clientBBranch.on('error', function (err) {
//     console.log('Redis B Şubesi Clientda bir hata var ' + err);
// });

module.exports = { clientABranch }