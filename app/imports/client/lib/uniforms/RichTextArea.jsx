import React from "react";
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";
import "react-select/dist/react-select.css";
import RichTextEditor, { EditorValue } from "react-rte";
import EditorDropdown from "./EditorDropdown";
import { Modifier, EditorState } from "draft-js";

class RichTextArea extends React.Component {
  constructor(props) {
    super(...arguments, props);
    this._intermediate = "";
    this.state = {
      value: RichTextEditor.createEmptyValue()
    };
  }

  componentWillMount() {
    if (this.props.value) {
      this.setState({
        value: RichTextEditor.createValueFromString(this.props.value, "html")
      });
    }
  }

  onChange = value => {
    this.setState({ value });
    this.props.onChange(value.toString("html"));
  };

  setEditorValue = (newValue, editorState) => {
    const contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      `{${newValue}}`
    );

    const nextEditorState = EditorState.push(
      editorState,
      contentState,
      "insert-characters"
    );
    this.onChange(new EditorValue(nextEditorState));
  };

  render() {
    const customControls = [
      (setter, getter, editorState) => {
        return (
          <EditorDropdown
            editorState={editorState}
            setEditorValue={this.setEditorValue}
          />
        );
      }
    ];
    const { id, label, ...props } = this.props;
    const { value } = this.state;
    return (
      <div {...filterDOMProps(props)}>
        {label && <label htmlFor={id}>{label}</label>}
        <RichTextEditor
          value={value}
          onChange={this.onChange}
          customControls={customControls}
        />
      </div>
    );
  }
}

export default connectField(RichTextArea, {
  ensureValue: false,
  includeInChain: false
});
