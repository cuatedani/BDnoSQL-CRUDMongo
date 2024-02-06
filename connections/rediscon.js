//Redis
const redis = require('redis')

const redisclient = redis.createClient({
    host: "localhost",
    port: "6379"
})

module.exports = redisclient;