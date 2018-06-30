import React from 'react';
import PropTypes from 'prop-types';

class Icon extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {name} = this.props;

        let rootUrl = Meteor.absoluteUrl();

        if(Meteor.settings.public.ROOT_URL) {
            rootUrl = Meteor.settings.public.ROOT_URL
        }

        return (
            <i className={`cc-icon cc-icon-${name}`}>
                <svg className="cc-svg-icon">
                    <use xlinkHref={`${rootUrl}assets/icons/icons.svg#icon-${name}`}>
                    </use>
                </svg>
            </i>
        )
    }
}

Icon.propTypes = {
    name: PropTypes.string.isRequired
};

Icon.defaultProps = {};

export default Icon;