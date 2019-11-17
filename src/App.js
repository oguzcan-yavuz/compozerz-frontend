import React, { Component } from 'react';
import Composers from './components/composers';
import Piano from './components/piano/piano';
import { toTitleCase } from './utils';
import { getAllComposers, generateMelodyByComposer } from './services/composer';


class App extends Component {
  state = {
    composers: []
  }

  formatComposers(composers) {
    return composers
      .map(composer => ({ ...composer, name: toTitleCase(composer.name) }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  componentDidMount() {
    getAllComposers().then(composers => {
      this.setState({ composers: this.formatComposers(composers) })
    })
  }

  render() {
    return (
      <div>
        <Piano />
        <Composers composers={this.state.composers} melodyGenerator={generateMelodyByComposer} />
      </div>
    );
  }
}

export default App;
