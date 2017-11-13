import React from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class BitcoinCash extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bittrex_usd: {
        last: 0,
      },
      bitfinex_usd: {
        last: 0,
      },
      cex_usd: {
        last: 0,
      },
      koinex_inr: {
        last: 0,
      },
      coinbase_usd: {
        high: 0,
        low: 0
      },
      usd_inr: 0
    }
  }

  componentDidMount() {
    this.getUsdRate()
    this.getBittrexRates();
    this.getBitfinexRates();
    this.getCexRates();
    this.getKoinexRates();
  }

  getUsdRate() {
    axios.get('/api/usd_rate')
    .then((response) => {
      this.setState({
        usd_inr: response.data
      });
    }) 
  }

  getBittrexRates() {
    axios.get('/api/bittrex/bch')
    .then((response) => {
      this.setState({
        bittrex_usd: {
          last: response.data.Last,
        }
      });
    })
  }

  getBitfinexRates() {
    axios.get('/api/bitfinex/bch')
    .then((response) => {
      this.setState({
        bitfinex_usd: {
          last: response.data.last_price,
        }
      });
    })
  }

  getCexRates() {
    axios.get('/api/cex/bch')
    .then((response) => {
      this.setState({
        cex_usd: {
          last: response.data.last,
        }
      });
    })
  }

  getKoinexRates() {
    axios.get('/api/koinex')
    .then((response) => {
      this.setState({
        koinex_inr: {
          last : JSON.parse(response.data).prices.BCH
        }
      });
    })
  }

  getINRrates(market_rates, inr_to_usd=false) {
    let temp_rates = {};
    let display_rates = {};
    if(market_rates.last) {
      if(inr_to_usd) {
        temp_rates['last'] = (parseFloat(market_rates.last) / this.state.usd_inr).toFixed(2);
        display_rates['last'] = `${market_rates.last} (${temp_rates.last})`;
      } else {
        temp_rates['last'] = (parseFloat(market_rates.last) * this.state.usd_inr).toFixed(2);
        display_rates['last'] = `${temp_rates.last} (${market_rates.last})`;
      }
    } else {
      if(inr_to_usd) {
        temp_rates['high'] = (parseFloat(market_rates.high) / this.state.usd_inr).toFixed(2);
        temp_rates['low'] = (parseFloat(market_rates.low) / this.state.usd_inr).toFixed(2);
        display_rates['high'] = `${market_rates.high} (${temp_rates.high})`;
        display_rates['low'] = `${market_rates.low} (${temp_rates.low}})`;
      } else {
        temp_rates['high'] = (parseFloat(market_rates.high) * this.state.usd_inr).toFixed(2);
        temp_rates['low'] = (parseFloat(market_rates.low) * this.state.usd_inr).toFixed(2);
        display_rates['high'] = `${temp_rates.high} (${market_rates.high})`;
        display_rates['low'] = `${temp_rates.low} (${market_rates.low})`; 
      }
    }
    return display_rates;
  }
  
  getTableRows(market, market_rates, inr_to_usd=false) {
    let display_rates = this.getINRrates(market_rates, inr_to_usd);
    let table_row = (
      <TableRow>
        <TableRowColumn>{market}</TableRowColumn>
        <TableRowColumn>{display_rates.last}</TableRowColumn>
        <TableRowColumn>{display_rates.high}</TableRowColumn>
        <TableRowColumn>{display_rates.low}</TableRowColumn>
      </TableRow>);
    return table_row;
  }

  render() {
    let bittrex_rates = this.state.bittrex_usd;
    let bitfinex_rates = this.state.bitfinex_usd;

    return (
      <div>
        <h1>Bitcoin Cash Rates</h1>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Market</TableHeaderColumn>
              <TableHeaderColumn>Current price</TableHeaderColumn>
              <TableHeaderColumn>Buy</TableHeaderColumn>
              <TableHeaderColumn>Sell</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.getTableRows("Bittrex", this.state.bittrex_usd)}
            {this.getTableRows("Bitfinex", this.state.bitfinex_usd)}
            {this.getTableRows("CEX", this.state.cex_usd)}
            {this.getTableRows("Koinex", this.state.koinex_inr, true)}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default BitcoinCash;