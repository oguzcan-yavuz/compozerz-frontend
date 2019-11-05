import React, { useState, useEffect } from 'react';
const core = require('@magenta/music/node/core');

const generateURLForObject = obj => window.URL.createObjectURL(obj)

const DownloadButton = ({ composer, blobUrl }) => {
  const fileName = `${composer.name}.mid`;
  return (
    <a href={blobUrl} download={fileName}>Download as MIDI</a>
  )
}

const Composer = ({ composer, player, melodyGenerator }) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [blobUrl, setBlobUrl] = useState('');

  // TODO: add download option for saving the generated melody as midi file
  useEffect(() => {
    async function play(composerName) {
      const midi = await melodyGenerator(composerName);
      console.log('midi retrieved')
      const blobUrl = generateURLForObject(midi);
      setBlobUrl(blobUrl);
      console.log({ blobUrl })
      const noteSequences = await core.blobToNoteSequence(midi);
      console.log('converted the midi to note sequences successfully')
      player.start(noteSequences);
    }


    function stop() {
      player.stop();
    }

    if (isGenerated) {
      play(composer.name);
    } else {
      stop();
    }

  }, [isGenerated])

  return (
    <div className="card" key={composer.name}>
      <div className="card-body">
        <h5 className="card-title">{composer.name}</h5>
        <button onClick={() => setIsGenerated(true)}>Generate</button>
        <button onClick={() => setIsGenerated(false)}>Stop</button>
        {isGenerated && blobUrl !== '' &&
          <DownloadButton composer={composer} blobUrl={blobUrl}></DownloadButton>
        }
      </div>
    </div>
  )
}

export default Composer
