import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import 'react-select/dist/react-select.css';
import RichTextEditor from 'react-rte';

class RichTextArea extends React.Component {
    constructor(props) {
        super(...arguments, props);
        this._intermediate = '';
        this.state = {
            value: RichTextEditor.createEmptyValue()
        }
    }

    componentWillReceiveProps(props) {
        if (props.value && !props.changed) {
            this.setState({value: RichTextEditor.createValueFromString(props.value, 'html')})
        }
    }

    onChange = (value) => {
        this.setState({value});
        this._intermediate = value.toString('html');
        this.props.onChange(this._intermediate);
        this._intermediate = '';
    };

    render() {
        const {
            id,
            label,
            ...props,
        } = this.props;
        const {value} = this.state;

        return (
            <div {...filterDOMProps(props)}>
                {label && (
                    <label htmlFor={id}>
                        {label}
                    </label>
                )}
                <RichTextEditor
                    value={value}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default connectField(RichTextArea, {ensureValue: false, includeInChain: false});