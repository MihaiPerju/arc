import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectMulti extends React.Component {
    constructor(props) {
        super(...arguments, props);
        this._intermediate = [];
        this.state = {
            value: props.value
        }
    }

    onChange = (newValue) => {
        const selectedValues = _.pluck(newValue, 'value');
        this.setState({
            value: selectedValues
        });
        this._intermediate = selectedValues;
        this.props.onChange(this._intermediate);
        this._intermediate = [];
    };

    render() {
        const {
            id,
            label,
            options,
            labelhidden,
            placeholder,
            ...props
        } = this.props;
        const {value} = this.state;

        return (
            <div {...filterDOMProps(props)}>
                {label && !labelhidden && (
                    <label htmlFor={id}>
                        {label}
                    </label>
                )}
                <Select
                    placeholder={placeholder}
                    onChange={this.onChange}
                    options={options}
                    value={value}
                    multi={true}
                />
            </div>
        );
    }
}

export default connectField(SelectMulti, {ensureValue: false, includeInChain: false});