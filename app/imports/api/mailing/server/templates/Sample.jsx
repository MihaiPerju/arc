// Sample Email
// Don't forget to add me to index.js

import React from 'react';
import { Dispatcher } from '/imports/api/events';
import send from '../send.js';

Dispatcher.on('sample', () => {
    const url = Meteor.absoluteUrl();

    send({
        to: 'someone@app.com',
        subject: 'Hello',
    }, Template, {url});
});

const Template = ({url}) => {
    return (
        <div>{url}</div>
    )
};
