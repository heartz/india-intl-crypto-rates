import React from 'react';


class Header extends React.Component {
  constructor(props){
    super(props);
    this.style = {
      ribbon: {
        position: 'absolute',
        top: 0,
        right: 0,
        border: 0
      },
      progressBar: {
        top: 0,
        textAlign: 'center',
        border: 0
      }
    }
  }

  render() {
    return (
      <div>
        <h2 style={this.style.progressBar}>This website is a work in progress.</h2>
        <a href="https://github.com/heartz/india-intl-crypto-rates">
          <img style={this.style.ribbon} 
          src="https://camo.githubusercontent.com/e7bbb0521b397edbd5fe43e7f760759336b5e05f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677265656e5f3030373230302e706e67"
          alt="Fork me on GitHub"
          data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png"/>
        </a>
        <h1 style={this.style.progressBar}>Cryptocurrency Rates</h1>
      </div>
    );
  }
}

export default Header;