import React from 'react';

const core = require('@magenta/music/node/core');
const player = new core.Player();
player.resumeContext(); // enable audio


const Composers = ({ composers, melodyGenerator }) => {
    async function play(composerName) {
        const midi = await melodyGenerator(composerName);
        console.log('yvz')
        console.log({ midi })
        const noteSequences = core.midiToSequenceProto(midi);
        console.log({ noteSequences })
        player.start(noteSequences);
    }

    function stop() {
        player.stop();
    }

    return (
    <div>
        <center><h1>Composer List</h1></center>
        {composers.map((composer) => (
        <div className="card" key={composer.name}>
            <div className="card-body">
                <h5 className="card-title">{composer.name}</h5>
                <button onClick={() => play(composer.name)}>Generate</button>
                <button onClick={stop}>Stop</button>
            </div>
        </div>
        ))}
    </div>
    )
};

export default Composers
