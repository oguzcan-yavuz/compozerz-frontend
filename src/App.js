import React, {Component} from 'react';
import axios from 'axios';
import Config from './config';
import Composers from './components/composers';

axios.defaults.baseURL = Config.composerService.baseURL;


class App extends Component {
  state = {
    composers: []
  }

  componentDidMount() {
    // TODO: get all components and set it to the state
    axios.get('/')
      .then(({ data }) => console.log(data))
  }

  render () {
    return (
      <Composers composers={this.state.composers} />
    );
  }
}

export default App;
