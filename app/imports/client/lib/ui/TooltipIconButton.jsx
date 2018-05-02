import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from "/imports/client/lib/Icon";

class TooltipIconButton extends Component {
    constructor(props) {
        super(props);
    }

    buttonClick = () => {
        this.props.buttonClick();
    };

    render() {
        const {
            className,
            type,
            tooltipText,
            position,
            iconName,
        } = this.props;

        let classes = classNames(
            'cc-button--icon',
            'cc-tooltip',
            `cc-tooltip--${position}`,
            className,
        );

        return (
            <button type={type}
                    className={classes}
                    onClick={this.buttonClick}>
                <Icon name={iconName}/>
                <span className="cc-tooltip__container">
                    {tooltipText}
                </span>
            </button>
        );
    }
}

TooltipIconButton.propTypes = {
    className: PropTypes.string,
    iconName: PropTypes.string.isRequired,
    position: PropTypes.string,
    tooltipText: PropTypes.string.isRequired,
    buttonClick: PropTypes.func,
};
TooltipIconButton.defaultProps = {
    className: '',
    type: 'button',
    position: 'bottom',
    buttonClick: function() {}
};

export default TooltipIconButton;
