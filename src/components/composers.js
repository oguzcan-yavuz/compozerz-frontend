import React from 'react';
import Composer from './composer'
const core = require('@magenta/music/node/core');

const player = new core.Player();
player.resumeContext(); // enable audio



const Composers = ({ composers, melodyGenerator }) => {
  return (
    <div>
      <center><h1>Composer List</h1></center>
      {composers.map((composer) => (
        <Composer composer={composer} player={player} melodyGenerator={melodyGenerator} key={composer.name}></Composer>
      ))}
    </div>
  )
};

export default Composers
