import React, { Component } from 'react';
import Composers from './components/composers';
import Piano from './components/piano/piano';
import { toTitleCase } from './utils';
import { getAllComposers, generateMelodyByComposer } from './services/composer';
import { Container } from 'react-bootstrap';

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
      <Container>
        <Piano />
        <Composers composers={this.state.composers} melodyGenerator={generateMelodyByComposer} />
      </Container>
    );
  }
}

export default App;
