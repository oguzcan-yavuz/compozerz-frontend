import React, { useState, useEffect } from 'react';
import Composer from './composer'
import { Row, Col } from 'react-bootstrap';
import { analyze } from 'web-audio-beat-detector';
import * as core from '@magenta/music/node/core'
import { NoteSequence } from '@magenta/music/node/protobuf'
import * as synth from 'synth-js';
import * as MidiWriter from 'midi-writer-js';

const player = new core.Player();
player.resumeContext(); // enable audio

const getInputSequence = async () => {
  const inputSequence = new NoteSequence()
  const track = new MidiWriter.Track();

  // TODO: same problem here: https://stackoverflow.com/questions/46856331/web-audio-api-get-audiobuffer-of-audio-element
  // solution?: convert midi to mp3, then download it as arraybuffer?
  window.recording.events.forEach(note => {
    inputSequence.notes.push({ pitch: note.midiNumber, startTime: note.time, endTime: note.time + note.duration, velocity: 80 })

    const midiNote = new MidiWriter.NoteEvent({ pitch: note.midiNumber, duration: note.duration });
    track.addEvent(midiNote);
  })

  const midiWriter = new MidiWriter.Writer(track);
  const midiBuffer = Buffer.from(midiWriter.buildFile());

  console.log('yvz events:', window.recording.events)
  console.log('yvz inputSeq:', inputSequence)
  console.log('yvz audioContext:', window._audioContext)
  console.log('yvz midiBuffer:', midiBuffer)

  const wavArray = Float32Array.from(synth.midiToWav(midiBuffer).toBuffer());

  console.log('yvz wavArray:', wavArray)

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const myArrayBuffer = audioCtx.createBuffer(1, 44100, 44100);
  // TODO: yvz i think it is not copying to the channel here, we are missing something, how it knows if it is wav or midi?
  await myArrayBuffer.copyToChannel(wavArray,0,0);

  console.log('yvz new audio context:', myArrayBuffer)

  // 2022.03.29: causes errors so commented out
  // analyze(myArrayBuffer).then(res => console.log('yvz analyzed tempo:', res))

  const tempo = 60
  inputSequence.tempos.push({ qpm: tempo })

  return inputSequence
}

const Composers = ({ composers, melodyGenerator }) => {
  const [composer, setComposer] = useState({});

  const getComposerFromOption = composers => {
    const composerName = document.getElementById('byComposerName').value;
    const composer = composers.find(composer => composer.name === composerName);
    setComposer(composer);
  }

  useEffect(() => {
    async function play(composerName) {
      const inputSequence = await getInputSequence()
      const midi = await melodyGenerator(composerName, inputSequence);
      console.log('midi retrieved')
      const noteSequences = await core.blobToNoteSequence(midi);
      console.log('converted the midi to note sequences successfully')
      // TODO: yvz use piano here for the output
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
