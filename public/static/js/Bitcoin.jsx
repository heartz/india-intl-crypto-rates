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

class Bitcoin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bittrex_usd: {
        last: 0,
        high: 0,
        low: 0
      },
      bitfinex_usd: {
        last: 0,
        high: 0,
        low: 0
      },
      coinbase_usd: 0,
      usd: 0,
      zebpay: 0
    }
  }

  componentDidMount() {
    this.getBittrexRates();
    this.getBitfinexRates();
    this.getCoinbaseRates();
  }

  getBittrexRates() {
    axios.get('/api/bittrex/btc')
    .then((response) => {
      this.setState({
        bittrex_usd: {
          last: response.data.Last,
          high: response.data.High,
          low: response.data.Low
        }
      });
    })
  }

  getBitfinexRates() {
    axios.get('/api/bitfinex/btc')
    .then((response) => {
      this.setState({
        bitfinex_usd: {
          last: response.data.last_price,
          high: response.data.high,
          low: response.data.low
        }
      });
    })
  }

  getCoinbaseRates() {
    axios.get('/api/coinbase/btc')
    .then((response) => {
      this.setState({
        coinbase_usd: response.data.data.amount
      });
    })
  }

  getTableRows(market, last, high='---', low='---') {
    var table_row = (
      <TableRow>
        <TableRowColumn>{market}</TableRowColumn>
        <TableRowColumn>{last}</TableRowColumn>
        <TableRowColumn>{high}</TableRowColumn>
        <TableRowColumn>{low}</TableRowColumn>
      </TableRow>);
    return table_row;
  }

  render() {
    let bittrex_rates = this.state.bittrex_usd;
    let bitfinex_rates = this.state.bitfinex_usd;
    return (
      <div>
        Bitcoin Rates
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Market</TableHeaderColumn>
              <TableHeaderColumn>Last</TableHeaderColumn>
              <TableHeaderColumn>High</TableHeaderColumn>
              <TableHeaderColumn>Low</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.getTableRows("Bittrex", bittrex_rates.last, bittrex_rates.high, bittrex_rates.low)}
            {this.getTableRows("Bitfinex", bitfinex_rates.last, bitfinex_rates.high, bitfinex_rates.low)}
            {this.getTableRows("Coinbase", this.state.coinbase_usd)}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default Bitcoin;