import React from 'react';


class Footer extends React.Component {
  constructor(props){
    super(props);
    this.style = {
      progressBar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        textAlign: 'center',
        border: 0
      }
    }
  }

  render() {
    return (
      <div style={this.style.progressBar}>Contact: ranadipheartz@gmail.com <br/>
        Donations: ETH 0x6e457934449fCd3F8cC7A630013c5FC6A29f26A6 </div>
    );
  }
}

export default Footer;