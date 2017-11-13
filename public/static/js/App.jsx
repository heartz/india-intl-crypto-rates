import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import Bitcoin from './Bitcoin.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

class App extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider  muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
          <Header/>
          <Bitcoin/>
          <Footer/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;