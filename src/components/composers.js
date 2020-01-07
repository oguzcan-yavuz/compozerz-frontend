import React, { useState, useEffect } from 'react';
import Composer from './composer'
import { Row, Col, Container } from 'react-bootstrap';
const core = require('@magenta/music/node/core');

const player = new core.Player();
player.resumeContext(); // enable audio

const Composers = ({ composers, melodyGenerator }) => {
  const [composer, setComposer] = useState({});

  const getComposerFromOption = composers => {
    const composerName = document.getElementById('byComposerName').value;
    const composer = composers.find(composer => composer.name === composerName);
    setComposer(composer);
  }

  useEffect(() => {
    async function play(composerName) {
      const midi = await melodyGenerator(composerName);
      console.log('midi retrieved')
      const noteSequences = await core.blobToNoteSequence(midi);
      console.log('converted the midi to note sequences successfully')
      player.start(noteSequences);
    }

    function stop() {
      player.stop();
    }

    if (Object.keys(composer).length !== 0) {
      play(composer.name);
    } else {
      stop();
    }

  }, [composer])


  return (
    <Row>
      <Col style={{textAlign: 'center', margin : '50px'}}>
        <h3>Then choose a composer to play the melody you just recorded</h3>
        <select id='byComposerName'>
          {composers.map((composer) => (
            <Composer composer={composer} player={player} melodyGenerator={melodyGenerator} key={composer.name}></Composer>
          ))}
        </select>
        <button onClick={() => getComposerFromOption(composers)}>Generate</button>
        <button onClick={() => setComposer({})}>Stop</button>
      </Col>
    </Row>
  )
};

export default Composers
