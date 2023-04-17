import React from 'react';
import _ from 'lodash';
import { KeyboardShortcuts, MidiNumbers } from 'react-piano';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faUndoAlt } from '@fortawesome/free-solid-svg-icons'
import 'react-piano/dist/styles.css';

import SoundfontProvider from './SoundfontProvider';
import PianoWithRecording from './PianoWithRecording';
import { Row, Col, Button } from 'react-bootstrap';

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

class Piano extends React.Component {
  state = {
    recording: {
      mode: 'RECORDING',
      events: [],
      currentTime: 0,
      currentEvents: [],
    },
  };

  constructor(props) {
    super(props);

    this.scheduledEvents = [];
  }

  getRecordingEndTime = () => {
    if (this.state.recording.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...this.state.recording.events.map(event => event.time + event.duration),
    );
  };

  setRecording = value => {
    this.setState({
      recording: Object.assign({}, this.state.recording, value),
    });
    window.recording = this.state.recording
    window._audioContext = audioContext
  };

  onClickPlay = () => {
    this.setRecording({
      mode: 'PLAYING',
    });
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.recording.events, event => [
        event.time,
        event.time + event.duration,
      ]),
    );
    startAndEndTimes.forEach(time => {
      this.scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = this.state.recording.events.filter(event => {
            return event.time <= time && event.time + event.duration > time;
          });
          this.setRecording({
            currentEvents,
          });
        }, time * 1000),
      );
    });
    // Stop at the end
    setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);
  };

  onClickStop = () => {
    this.scheduledEvents.forEach(scheduledEvent => {
      clearTimeout(scheduledEvent);
    });
    this.setRecording({
      mode: 'RECORDING',
      currentEvents: [],
    });
  };

  onClickClear = () => {
    this.onClickStop();
    this.setRecording({
      events: [],
      mode: 'RECORDING',
      currentEvents: [],
      currentTime: 0,
    });
  };

  render() {
    return (
      <div>
        <Row>
          <Col style={{textAlign: 'center', margin: '20px'}}>
            <h1>Record a melody first</h1>
          </Col>
        </Row>

        <Row>
          <Col className='d-flex justify-content-center'>
          <SoundfontProvider
                instrumentName="acoustic_grand_piano"
                audioContext={audioContext}
                hostname={soundfontHostname}
                render={({ isLoading, playNote, stopNote }) => (
                  <PianoWithRecording
                    recording={this.state.recording}
                    setRecording={this.setRecording}
                    noteRange={noteRange}
                    width={800}
                    playNote={playNote}
                    stopNote={stopNote}
                    disabled={isLoading}
                    keyboardShortcuts={keyboardShortcuts}
                  />
                )}
              />
          </Col>
        </Row>

        <Row>
          <Col style={{textAlign: 'center', margin: '30px'}}>
            <Button variant="outline-success" onClick={this.onClickPlay}> <FontAwesomeIcon icon={faPlay}/> Play </Button>
            <Button variant="outline-danger" onClick={this.onClickStop}> <FontAwesomeIcon icon={faStop}/> Stop</Button>
            <Button variant="outline-info" onClick={this.onClickClear}> <FontAwesomeIcon icon={faUndoAlt}/> Clear</Button>
          </Col>
        </Row>

        <Row>
          <Col style={{textAlign: 'center'}}>
              <strong>Recorded notes</strong>
              <div>{JSON.stringify(this.state.recording.events)}</div>
          </Col>
        </Row>

      </div>
    );
  }
}

export default Piano
