var bittrex = require('node-bittrex-api');
var request = require("request")
var express = require('express');
var expressRest = require('express-rest');
var app = express();
var rest = expressRest(app);
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

// API call to get current INR-USD rates

rest.get('/api/usd_rate',function(req, res){
  var url = "https://api.fixer.io/latest?base=USD";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body.rates.INR);
    }
  });
});

// Koinex ticker API, currently broken

rest.get('/api/koinex',function(req, res){
  var url = "https://koinex.in/api/ticker";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});

//API call for Zebpay (Only Bitcoin)

rest.get('/api/zebpay',function(req, res){
  var url = "https://www.zebapi.com/api/v1/market/ticker/btc/inr";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});

//API Calls for bittrex

rest.get('/api/bittrex', function(req, res) {
    bittrex.getmarketsummary( { market : 'USDT-BTC' }, function( data, err ) {
      res.ok(data.result[0]);
  });
});

rest.get('/api/bittrex/btc', function(req, res) {
  bittrex.getmarketsummary( { market : 'USDT-BTC' }, function( data, err ) {
    res.ok(data.result[0]);
  });
});

rest.get('/api/bittrex/eth', function(req, res) {
  bittrex.getmarketsummary( { market : 'USDT-ETH' }, function( data, err ) {
    res.ok(data.result[0]);
  });
});

rest.get('/api/bittrex/bch', function(req, res) {
  bittrex.getmarketsummary( { market : 'USDT-BCC' }, function( data, err ) {
    res.ok(data.result[0]);
  });
});

rest.get('/api/bittrex/ltc', function(req, res) {
  bittrex.getmarketsummary( { market : 'USDT-LTC' }, function( data, err ) {
    res.ok(data.result[0]);
  });
});

//API calls for Coinbase
//TODO: Remove callback hell

rest.get('/api/coinbase', function(req, res) {
  var Client = require('coinbase').Client;
  var client = new Client({'apiKey': 'API KEY',
                           'apiSecret': 'API SECRET'});
  client.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, buy) {
    client.getSellPrice({'currencyPair': 'BTC-USD'}, function(err, sell) {
      res.ok({
          'high': buy.data.amount,
          'low': sell.data.amount
      });
    });
  });
});

rest.get('/api/coinbase/btc', function(req, res) {
  var Client = require('coinbase').Client;
  var client = new Client({'apiKey': 'API KEY',
                           'apiSecret': 'API SECRET'});
  client.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, buy) {
    client.getSellPrice({'currencyPair': 'BTC-USD'}, function(err, sell) {
      res.ok({
          'high': buy.data.amount,
          'low': sell.data.amount
      });
    });
  });
});

rest.get('/api/coinbase/bch', function(req, res) {
  res.ok("Coinbase does not support Bitcoin cash");
});


rest.get('/api/coinbase/eth', function(req, res) {
  var Client = require('coinbase').Client;
  var client = new Client({'apiKey': 'API KEY',
                           'apiSecret': 'API SECRET'});
  client.getBuyPrice({'currencyPair': 'ETH-USD'}, function(err, buy) {
    client.getSellPrice({'currencyPair': 'ETH-USD'}, function(err, sell) {
      res.ok({
          'high': buy.data.amount,
          'low': sell.data.amount
      });
    });
  });
});

rest.get('/api/coinbase/ltc', function(req, res) {
  var Client = require('coinbase').Client;
  var client = new Client({'apiKey': 'API KEY',
                           'apiSecret': 'API SECRET'});
  client.getBuyPrice({'currencyPair': 'LTC-USD'}, function(err, buy) {
    client.getSellPrice({'currencyPair': 'LTC-USD'}, function(err, sell) {
      res.ok({
          'high': buy.data.amount,
          'low': sell.data.amount
      });
    });
  });
});

//API calls for Bitfinex

rest.get('/api/bitfinex',function(req, res){
  var url = "https://api.bitfinex.com/v1/pubticker/btcusd";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});

rest.get('/api/bitfinex/btc',function(req, res){
  var url = "https://api.bitfinex.com/v1/pubticker/btcusd";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});


rest.get('/api/bitfinex/eth',function(req, res){
  var url = "https://api.bitfinex.com/v1/pubticker/ethusd";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});


rest.get('/api/bitfinex/bch',function(req, res){
  var url = "https://api.bitfinex.com/v1/pubticker/bchusd";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});


rest.get('/api/bitfinex/ltc',function(req, res){
  var url = "https://api.bitfinex.com/v1/pubticker/ltcusd";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});

// API calls for CEX

rest.get('/api/cex',function(req, res){
  var url = "https://cex.io/api/ticker/BTC/USD";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});

rest.get('/api/cex/btc',function(req, res){
  var url = "https://cex.io/api/ticker/BTC/USD";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});


rest.get('/api/cex/eth',function(req, res){
  var url = "https://cex.io/api/ticker/ETH/USD";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});


rest.get('/api/cex/bch',function(req, res){
  var url = "https://cex.io/api/ticker/BCH/USD";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.ok(body);
    }
  });
});


rest.get('/api/cex/ltc',function(req, res){
  res.ok("CEX does not support Litecoin");
});