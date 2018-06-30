import { Email } from 'meteor/email';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Config from './config';

const debug = Meteor.isDevelopment;
// const debug = false;

/**
 * React Email Sender
 *
 * send({to: 'xxx@xxx.com'}, Component, props)
 *
 * @param mailConfig
 * @param Component
 * @param props
 * @returns {*}
 */
export default function (mailConfig, Component, props) {
    let subject = 'No Subject';
    const Element = React.createElement(Component, props);
    subject = Element.subject || subject;

    let options = _.extend({}, {
        subject,
        from: Config.from,
        html: ReactDOM.renderToString(Element)
    }, mailConfig);

    if (debug) {
    } else {
        Email.send(options);
    }
}