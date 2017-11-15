# india-intl-crypto-rates
A simple page to get and compare rates between Indian markets and International exchanges.

Try out the [Live demo](https://moonlit-academy-178514.appspot.com/)!

## Starting the server

```
git clone https://github.com/heartz/india-intl-crypto-rates.git
cd india-intl-crypto-rates
npm install
npm start
```

You can then point your browser to  ```localhost:3000```.

## API 

API calls for current price (and sometimes other trade information) for the following Exchanges are available:

* [Bittrex](www.bittrex.com)
* [Bitfinex](www.bitfinex.com)
* [Coinbase](www.coinbase.com)
* [CEX](www.cex.io)
* [Zebpay](www.zebpay.com)
* [Koinex](https://koinex.in) (slightly unstable)

Currently only supports BTC, ETH, BCH and LTC (Except Zebpay which only supports BTC).

#### Price Only API calls

These APIs can be used to fetch the prices of the Cryptocurrencies from each of the markets.

Usage: ```/prices/<market>``` to get the price for the specific market.  
To get the price for all the markets listed above use ```/prices/all```.

NOTE: This prices are NOT REAL TIME. The values are refreshed every 15 seconds.

#### Direct Market API calls

These API calls are the actual API calls from the markets, instead of having to write your code for each of these markets and contacting them, you can use these. 

To use the API calls:
```
/api/<market>/<ticker>
```
Example:

```
/api/bittrex/btc
```

If no ticker is provided, btc is taken as default.
Some markets such as Zebpay and Koinex display all their data in a single call without any ticker.

You can also check the current INR-USD rates using
```
/api/usd_rate
```

This data is fetched using [Fixer](http://fixer.io/).


## TODO

* Building the Arbitrage calculator.
* Auto update prices every few seconds.
* Add more exchanges
* Display price according to [CoinMarketCap](https://coinmarketcap.com/) at the top.
* Show price difference from CMC for each.
* Sort by price.
* Sort by premium being paid (in %) for each market.(Suggesting best coin to buy if all at premium).
* Caching the market data for 10 seconds instead of fetching from market on each page load.(Reduce latency).

Contact: ranadipheartz@gmail.com   
Donations:  
ETH: 0x6e457934449fCd3F8cC7A630013c5FC6A29f26A6   
BTC: 1QBTqvzfQjciKcdt6AXsESGEySxf67E3T4  
NEO: Abj6qZSyM7HcvY9vukTykfoyu7E1GPLKrf
