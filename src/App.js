import React, {Component} from 'react';
import axios from 'axios';
import Config from './config';
import Composers from './components/composers';
import { toTitleCase } from './utils';
import FileSaver from 'file-saver';


axios.defaults.baseURL = Config.composerService.baseUrl;


class App extends Component {
  state = {
    composers: []
  }

  formatComposers(composers) {
    return composers
      .map(composer => ({ ...composer, name: toTitleCase(composer.name) }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  getAllComposers() {
    return axios.get('/composers').then(({ data }) => data);
  }

  generateMelodyFromComposer(composerName) {
    // TODO: fill the body with input melody lol (it will be retrieved from state i guess)
    const body = {};
    return axios({
      method: 'post',
      url: `/composers/${composerName}/generate`,
      data: body,
      responseType: 'blob'
    }).then(({ data }) => {
      const path = 'midi.mid'
      FileSaver.saveAs(fileData, fileName);
    });
  }

  componentDidMount() {
    this.getAllComposers().then(composers => {
        this.setState({ composers: this.formatComposers(composers) })
    })
  }

  render () {
    return (
      <Composers composers={this.state.composers} melodyGenerator={this.generateMelodyFromComposer} />
    );
  }
}

export default App;
