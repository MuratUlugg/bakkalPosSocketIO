var config = {
    port: 3000,
    secret: 'secret',

    redisConfAcompany: {
        host: '192.168.1.6', // The redis's ABranch server ip 
        port: '6379'
    },

    redisConfBcompany: {
        host: '192.168.1.7', // The redis's BBranch server ip 
        port: '6379'
    }
};
module.exports = config;