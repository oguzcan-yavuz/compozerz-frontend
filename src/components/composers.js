import React from 'react'

const Composers = ({ composers }) => {
    return (
    <div>
        <center><h1>Composer List</h1></center>
        {composers.map((composer) => (
        <div class="card">
            <div class="card-body">
            <h5 class="card-title">{composer.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{composer.email}</h6>
            <p class="card-text">{composer.company.catchPhrase}</p>
            </div>
        </div>
        ))}
    </div>
    )
};

export default Composers
