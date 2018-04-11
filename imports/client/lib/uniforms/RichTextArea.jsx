import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import 'react-select/dist/react-select.css';
import RichTextEditor from 'react-rte';
import EditorDropdown from "./EditorDropdown";

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

    componentWillMount() {
        if (this.props.value) {
            this.setState({value: RichTextEditor.createValueFromString(this.props.value, 'html')})
        }
    }

    onChange = (value) => {
        this.setState({value});
        this._intermediate = value.toString('html');
        this.props.onChange(this._intermediate);
        this._intermediate = '';
    };

    setEditorValue = (newValue, editorState) => {
        const letterContent = editorState.getCurrentContent().getPlainText();
        const cursorPoint = editorState.getSelection().getEndOffset();
        const output = [letterContent.slice(0, cursorPoint), " {", newValue, "} ", letterContent.slice(cursorPoint)].join('');
        const value = RichTextEditor.createValueFromString(output, 'html');
        this.setState({value});
        this._intermediate = value.toString('html');
        this.props.onChange(this._intermediate);
    };

    render() {
        const customControls = [
            (setter, getter, editorState) => {
                return <EditorDropdown editorState={editorState} setEditorValue={this.setEditorValue}/>
            }
        ];
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
                    customControls={customControls}
                />
            </div>
        );
    }
}

export default connectField(RichTextArea, {ensureValue: false, includeInChain: false});