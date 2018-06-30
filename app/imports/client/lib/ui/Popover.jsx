import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Popover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popoverActive: false
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick, false);
        setTimeout(() => {
            this.setState({popoverActive: true});
        }, 1);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    handleOutsideClick = (e) => {
        if (!this.popover.contains(e.target)) {
            this.setState({popoverActive: false});

            setTimeout(() => {
                this.props.closePopover();
            }, 200);
        }
    };

    onPopoverMount = (node) => this.popover = node;

    render() {
        const { className, children } = this.props;
        const { popoverActive } = this.state;
        let classes = classNames(
            'cc-popover',
            className, {
                'cc-popover--active': popoverActive
            }
        );

        return (
            <div className={classes} ref={this.onPopoverMount}>
                {children}
            </div>
        );
    }
}

Popover.propTypes = {
    closePopover: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node
};

Popover.defaultProps = {};

export default Popover;
