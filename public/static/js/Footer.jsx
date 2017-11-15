import React from 'react';


class Footer extends React.Component {
  constructor(props){
    super(props);
    this.style = {
      progressBar: {
        bottom: 0,
        right: 0,
        marginTop: '100px',
        textAlign: 'center',
        border: 0
      }
    }
  }

  render() {
    return (
      <div style={this.style.progressBar}>
        <p>Contact: ranadipheartz@gmail.com</p>
        <p>Donations:</p>
        <p>ETH: 0x6e457934449fCd3F8cC7A630013c5FC6A29f26A6</p>
        <p>BTC: 1QBTqvzfQjciKcdt6AXsESGEySxf67E3T4</p>
        <p>NEO: Abj6qZSyM7HcvY9vukTykfoyu7E1GPLKrf</p>
      </div>
    );
  }
}

export default Footer;