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

    onChange = (value) => {
        this.setState({value});
        if (this.props.onChange) {
            this.props.onChange(
                value.toString('html')
            );
        }
        this._intermediate = value.toString('html');
        this.props.onChange(this._intermediate);
        this._intermediate = '';
    };

    render() {
        const {
            id,
            label,
            value,
            ...props,
        } = this.props;

        return(
            <div {...filterDOMProps(props)}>
                {label && (
                    <label htmlFor={id}>
                        {label}
                    </label>
                )}
                <RichTextEditor
                    value={RichTextEditor.createValueFromString(value, 'html')}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default connectField(RichTextArea, {ensureValue: false, includeInChain: false});