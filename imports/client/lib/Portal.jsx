import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

/**
 * React component for transportation. Creates a new top-level React tree and injects its children
 */
class Portal extends Component {
    constructor(props) {
        super(props);
        this.node = null;
    }

    componentDidMount() {
        this.openPortal(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.node && this.props.className !== nextProps.className) {
            this.node.className = nextProps.className;
        }
        this.openPortal(nextProps);
    }

    componentWillUnmount() {
        this.closePortal();
    }

    openPortal(props) {
        if (!this.node) {
            this.node = document.createElement('div');
            if (props.className) {
                this.node.className = props.className;
            }
            document.body.appendChild(this.node);
        }

        ReactDOM.unstable_renderSubtreeIntoContainer(
            this,
            props.children,
            this.node,
        );
    }

    closePortal() {
        if (this.node) {
            ReactDOM.unmountComponentAtNode(this.node);
            document.body.removeChild(this.node);
        }
        this.node = null;
    }

    render() {
        return null;
    }
}

Portal.propTypes = {
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
};

export default Portal;
