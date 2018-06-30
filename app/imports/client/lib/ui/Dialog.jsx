import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Portal from '/imports/client/lib/Portal';

class Dialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogActive: false
        };
    }

    componentDidMount() {
        document.body.classList.add('cc-dialog-open');
        setTimeout(() => {
            this.setState({dialogActive: true});
        }, 1);
    }

    componentWillUnmount() {
        document.body.classList.remove('cc-dialog-open');
    }

    dialogClose = () => {
        this.setState({dialogActive: false});
        setTimeout(() => {
            this.props.closePortal();
        }, 300);
    };

    dialogStopPropagation = (e) => {
        e.stopPropagation();
    };

    render() {
        const { dialogActive } = this.state;
        const { className, title, actions, children } = this.props;
        let classes = classNames(
            'cc-dialog',
            className,  {
                'cc-dialog--active': dialogActive
            }
        );

        const actionsContainer = React.Children.count(actions) > 0 && (
            <div className="cc-dialog__actions">
                {React.Children.toArray(actions)}
            </div>
        );

        return (
            <Portal>
                <aside className={classes} onClick={this.dialogClose}>
                    <div className="cc-dialog__card" onClick={this.dialogStopPropagation}>
                        <div className="cc-dialog__title">
                            {title}
                        </div>
                        <div className="cc-dialog__content">
                            {children}
                        </div>
                        {actionsContainer}
                    </div>
                </aside>
            </Portal>
        );
    }
}

Dialog.propTypes = {
    closePortal: PropTypes.func.isRequired,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    actions: PropTypes.node
};
Dialog.defaultProps = {};

export default Dialog;
