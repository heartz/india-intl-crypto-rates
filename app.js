let bittrex = require('node-bittrex-api');
let request = require("request")
let express = require('express');
let expressRest = require('express-rest');
let app = express();
let rest = expressRest(app);
let server = require('http').createServer(app);
let port = process.env.PORT || 3000;
let curl = require('curlrequest');
let cron = require('node-cron');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

// Cached prices of markets

let usd_rates = 0;

let bittrex_rates = {
  btc: 0,
  ltc: 0,
  bch: 0,
  eth: 0
};

let koinex_rates = {
  btc: 0,
  ltc: 0,
  bch: 0,
  eth: 0
};

let coinbase_rates = {
  btc: {
    buy: 0,
    sell: 0
  },
  ltc: {
    buy: 0,
    sell: 0
  },
  eth: {
    buy: 0,
    sell: 0
  }
};

let bitfinex_rates = {
  btc: 0,
  ltc: 0,
  bch: 0,
  eth: 0
};

let cex_rates = {
  btc: 0,
  bch: 0,
  eth: 0
};

let zebpay_rates = {
  btc: {
    buy: 0,
    sell: 0
  }
};

// Cron that runs every 15 seconds to update the cached prices

let scheduled_job = cron.schedule('*/15 * * * * *', fetchAllRates);

function fetchAllRates (){
  fetchUSDRates();
  fetchBittrexRates();
  fetchKoinexRates();
  fetchCoinbaseRates();
  fetchBitfinexRates('btc');
  fetchBitfinexRates('ltc');
  fetchBitfinexRates('eth');
  fetchBitfinexRates('bch');
  fetchCEXRates('btc');
  fetchCEXRates('eth');
  fetchCEXRates('bch');
  fetchZebpayRates();
}

// Calls to fetch and store the market price in cache

function fetchUSDRates() {
  let url = "https://api.fixer.io/latest?base=USD";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      usd_rates = body.rates.INR;
    }
  });
}

function fetchBittrexRates() {
  bittrex.getticker( { market : 'USDT-BTC' }, function( data ) {
    bittrex_rates.btc = data.result.Last;
  });
  bittrex.getticker( { market : 'USDT-BCC' }, function( data ) {
    bittrex_rates.bch = data.result.Last;
  });
  bittrex.getticker( { market : 'USDT-ETH' }, function( data ) {
    bittrex_rates.eth = data.result.Last;
  });
  bittrex.getticker( { market : 'USDT-LTC' }, function( data ) {
    bittrex_rates.ltc = data.result.Last;
  });
}

function fetchKoinexRates() {
  let options = {
    url : 'https://koinex.in/api/ticker',
    header : [
      {
        'cookie': '__cfduid=d7b9e385253fdf3f698753beb7ec93b551507708166; cf_clearance=21ad6447b28165998f71561c830cc82796201d14-1510590752-3600; _koinex-frontend_session=MEJ0ZW52ZjlxdlBOOFgzV3IwWFVNNGZKZXVXODRWVE9RWWRyazlKVVlTSmN4MitSV2hyVGxxdkowUENpajlDdnhnSlhOYUFmNkdTdmlSaXVwMUR5aTQ2TGJQOWFxQTRTRW9CbTlvNndtajA1Sk4zQ0hGdnozcTRJN2ZFOE5aMzFkM3NGeWZoakNIaDdycWVmelJVM3BRPT0tLW0wbVZ3Q0VpWHlrNHltQ1kxcHNPS3c9PQ%3D%3D--8897cc6f6df1da0edb1f9d8fddbff5a09bfb77cb; _ga=GA1.2.1600254668.1507708173; _gid=GA1.2.287117624.1510548185'
      }, {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'
      }, {
        'cache-control': 'max-age=0'
      }
    ]
  }

  curl.request(options, function (err, data) {
    let prices = {}
    try {
      prices =JSON.parse(data).prices;
    }
    catch(e) {
      console.log("Koinex cloudflare expection");
    }
    koinex_rates = {
      btc: prices.BTC,
      ltc: prices.LTC,
      bch: prices.BCH,
      eth: prices.ETH
    }
  });
}

function fetchCoinbaseRates() {
  let Client = require('coinbase').Client;
  let client = new Client({'apiKey': 'API KEY',
                           'apiSecret': 'API SECRET'});
  client.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, buy) {
    client.getSellPrice({'currencyPair': 'BTC-USD'}, function(err, sell) {
      coinbase_rates.btc = {
        buy: buy.data.amount,
        sell: sell.data.amount
      };
    });
  });
  client.getBuyPrice({'currencyPair': 'ETH-USD'}, function(err, buy) {
    client.getSellPrice({'currencyPair': 'ETH-USD'}, function(err, sell) {
      coinbase_rates.eth = {
        buy: buy.data.amount,
        sell: sell.data.amount
      };
    });
  });
  client.getBuyPrice({'currencyPair': 'LTC-USD'}, function(err, buy) {
    client.getSellPrice({'currencyPair': 'LTC-USD'}, function(err, sell) {
      coinbase_rates.ltc = {
        buy: buy.data.amount,
        sell: sell.data.amount
      };
    });
  });
}

function fetchBitfinexRates(ticker) {
  let url = 'https://api.bitfinex.com/v1/pubticker/' + ticker + 'usd';
  let value = request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let eval_string = 'bitfinex_rates.' + ticker + ' = (body.last_price)';
      eval(eval_string);
    }
  });
}

function fetchCEXRates(ticker) {
  let url = 'https://cex.io/api/ticker/' + ticker.toUpperCase() +'/USD';
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let eval_string = 'cex_rates.' + ticker + ' = (body.last)';
      eval(eval_string);
    }
  });
}

function fetchZebpayRates(){
  let url = "https://www.zebapi.com/api/v1/market/ticker/btc/inr";
  request({
    url: url,
    json: true
  },
  function (error, response, body) {
    if (!error && response.statusCode === 200) {
      zebpay_rates.btc = {
        buy: body.buy,
        sell: body.sell
      };
    }
  });
}

// API call to get current INR-USD rates

rest.get('/api/usd_rate',function(req, res){
  let url = "https://api.fixer.io/latest?base=USD";
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

// Koinex ticker API, currently unstable

rest.get('/api/koinex',function(req, res){
  let options = {
    url : 'https://koinex.in/api/ticker',
    header : [
      {
        'cookie': '__cfduid=d7b9e385253fdf3f698753beb7ec93b551507708166; cf_clearance=21ad6447b28165998f71561c830cc82796201d14-1510590752-3600; _koinex-frontend_session=MEJ0ZW52ZjlxdlBOOFgzV3IwWFVNNGZKZXVXODRWVE9RWWRyazlKVVlTSmN4MitSV2hyVGxxdkowUENpajlDdnhnSlhOYUFmNkdTdmlSaXVwMUR5aTQ2TGJQOWFxQTRTRW9CbTlvNndtajA1Sk4zQ0hGdnozcTRJN2ZFOE5aMzFkM3NGeWZoakNIaDdycWVmelJVM3BRPT0tLW0wbVZ3Q0VpWHlrNHltQ1kxcHNPS3c9PQ%3D%3D--8897cc6f6df1da0edb1f9d8fddbff5a09bfb77cb; _ga=GA1.2.1600254668.1507708173; _gid=GA1.2.287117624.1510548185'
      }, {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'
      }, {
        'cache-control': 'max-age=0'
      }
    ]
  }

  curl.request(options, function (err, data) {
    res.ok(data);
  });
});

//API call for Zebpay (Only Bitcoin)

rest.get('/api/zebpay',function(req, res){
  let url = "https://www.zebapi.com/api/v1/market/ticker/btc/inr";
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
  let Client = require('coinbase').Client;
  let client = new Client({'apiKey': 'API KEY',
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
  let Client = require('coinbase').Client;
  let client = new Client({'apiKey': 'API KEY',
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
  let Client = require('coinbase').Client;
  let client = new Client({'apiKey': 'API KEY',
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
  let Client = require('coinbase').Client;
  let client = new Client({'apiKey': 'API KEY',
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
  let url = "https://api.bitfinex.com/v1/pubticker/btcusd";
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
  let url = "https://api.bitfinex.com/v1/pubticker/btcusd";
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
  let url = "https://api.bitfinex.com/v1/pubticker/ethusd";
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
  let url = "https://api.bitfinex.com/v1/pubticker/bchusd";
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
  let url = "https://api.bitfinex.com/v1/pubticker/ltcusd";
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
  let url = "https://cex.io/api/ticker/BTC/USD";
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
  let url = "https://cex.io/api/ticker/BTC/USD";
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
  let url = "https://cex.io/api/ticker/ETH/USD";
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
  let url = "https://cex.io/api/ticker/BCH/USD";
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


// API to fetch only prices

rest.get('/prices/koinex',function(req, res){
  res.ok(koinex_rates);
});

rest.get('/prices/cex',function(req, res){
  res.ok(cex_rates);
});

rest.get('/prices/bittrex',function(req, res){
  res.ok(bittrex_rates);
});

rest.get('/prices/bitfinex',function(req, res){
  res.ok(bitfinex_rates);
});

rest.get('/prices/coinbase',function(req, res){
  res.ok(coinbase_rates);
});

rest.get('/prices/zebpay',function(req, res){
  res.ok(zebpay_rates);
});

rest.get('/prices/all',function(req, res){
  let all_rates = {
    koinex: koinex_rates,
    bitfinex: bitfinex_rates,
    bittrex: bittrex_rates,
    cex: cex_rates,
    coinbase: coinbase_rates,
    zebpay_rates
  };
  res.ok(all_rates);
});

// Start the cron
fetchAllRates();
scheduled_job.start();