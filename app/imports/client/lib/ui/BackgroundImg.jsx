import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class BackgroundImg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isError: false
        }
    }

    loadImg = () => {
        this.img = new Image();
        this.img.src = this.props.src;
        this.img.onload = this.onLoad;
        this.img.onerror = this.onError;
    };

    onLoad = () => {
        this.setState({isLoaded: true});
    };

    onError = () => {
        this.setState({isError: true});
    };

    componentDidMount () {
        this.loadImg()
    }

    render() {
        const { isLoaded, isError } = this.state;
        const { src, className } = this.props;
        let bg = {};

        if (!src) {
            return null;
        }

        let classes = classNames(
            'cc-bg-container',
            className,  {
                'cc-bg--loaded': isLoaded,
                'cc-bg--error': isError,
            }
        );

        if (this.state.isLoaded) {
            bg = {
                backgroundImage: `url('${src}')`
            }
        }

        return (
          <div className={classes} style={bg} />
        );
    }
}

BackgroundImg.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
};
BackgroundImg.defaultProps = {};

export default BackgroundImg;