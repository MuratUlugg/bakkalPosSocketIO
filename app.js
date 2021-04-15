const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
//RabbitMQ
var amqp = require('amqplib/callback_api');
const rabbitUrl = 'amqp://192.168.1.6';
const opt = { credentials: require('amqplib').credentials.plain('guest', 'guest') }

//Redis
const redisClient = require('./redisClient');

io.on('connection', (socket) => {
    console.log(`User Socket Connected - ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`${socket.id} User disconnected.`)
    });
});

server.listen(1994);


var stockSchema = {
    stockCode: String,
    stockName: String,
    unit: String,
    quantityAvailable: Number,
    cost: Number,
    status: String,
    quantityOnOrder: Number,
    currencyCode: String ,
    supplierName: String,
    supplierId: String,
    createDate: Date ,
    lastQuantityUpdateDate: Date ,
    lastCostUpdateDate: Date ,
    lastUpdateDate: Date,
    categoryId: Number,
    picture: String,
}

amqp.connect(rabbitUrl, opt, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'stockChannel';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function (data) {
            updateStock = JSON.parse(data.content.toString())
            console.log(" [x] Received Stocks:", updateStock.stockName + " - " + updateStock.lastUpdateDate);         
            io.emit("updatedStocks", updateStock);
            if (redisClient.clientABranch.connected) {
                var stockKey = 'stock:' + updateStock.stockCode;
                //Redisde Haber Varsa Güncellenir..Değilse Kaydedilir.
                redisClient.clientABranch.set(stockKey, JSON.stringify(updateStock), function (err, res) { });
            }
            // if (redisClient.clientBCompany.connected) {
            //     var stockKey = 'stock:' + updateStock.stockCode;
            //     //Redisde Haber Varsa Güncellenir..Değilse Kaydedilir.
            //     redisClient.clientBCompany.set(stockKey, JSON.stringify(updateStock), function (err, res) { });
            // }
        }, {
            noAck: true
        });
    });
});