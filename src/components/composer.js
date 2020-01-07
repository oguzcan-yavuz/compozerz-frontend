import React from 'react';

const Composer = ({ composer, player, melodyGenerator }) => {
  return (
    <option value={composer.name}>
      {composer.name}
    </option>
  )
}

export default Composer
