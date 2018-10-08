import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import PropTypes from 'prop-types';

class DescriptionOption extends React.Component {
    constructor(props) {
        super(props);
    }

    handleMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.option, event);
    };

    handleMouseEnter = (event) => {
        this.props.onFocus(this.props.option, event);
    };

    handleMouseMove = (event) => {
        if (this.props.isFocused) return;
        this.props.onFocus(this.props.option, event);
    };

    render() {
        const {className, option, children} = this.props;

        return (
            <div className={className}
                 onMouseDown={this.handleMouseDown}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseMove={this.handleMouseMove}
                 title={option.description}>
                {children}
                <div>{option.description}</div>
            </div>
        );
    }
}

DescriptionOption.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isDisabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    option: PropTypes.object.isRequired,
};
DescriptionOption.defaultProps = {};

class DescriptionValue extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {value, children} = this.props;

        return (
            <div className="Select-value" title={value.description}>
                <span className="Select-value-label">
                    {children}
                </span>
            </div>
        );
    }
}

DescriptionValue.propTypes = {
    children: PropTypes.node,
    value: PropTypes.object,
};
DescriptionValue.defaultProps = {};

class SelectSingleWithDescription extends React.Component {
    constructor(props) {
        super(...arguments, props);
        this._intermediate = {};
        this.state = {
            value: props.value,
        };
    }

    onChange = (value) => {
        this.setState({value});
        this._intermediate = value;
        this.props.onChange(this._intermediate);
        this._intermediate = {};
    };

    render() {
        const {
            id,
            label,
            options,
            placeholder,
            hint,
            ...props
        } = this.props;
        const {value} = this.state;

        return (
            <div {...filterDOMProps(props)}>
                {label && (
                    <label htmlFor={id}>
                        {label}
                    </label>
                )}
                <Select
                    multi={false}
                    onChange={this.onChange}
                    optionComponent={DescriptionOption}
                    options={options}
                    placeholder={placeholder}
                    value={value}
                    valueComponent={DescriptionValue}
                />
                {hint && <div className="hint">{hint}</div>}
            </div>
        );
    }
}

SelectSingleWithDescription.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.object,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    hint: PropTypes.string
};
SelectSingleWithDescription.defaultProps = {};

export default connectField(SelectSingleWithDescription,
    {ensureValue: false, includeInChain: false});