import React from "react";
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";
import CKEditor from "react-ckeditor-component";
import variablesEnum from "/imports/api/letterTemplates/enums/variablesEnum";

class RichTextArea extends React.Component {
  constructor(props) {
    super(...arguments, props);
    this._intermediate = "";
    this.state = {
      value: ""
    };
  }

  componentWillMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  }

  onChange = evt => {
    var newContent = evt.editor.getData();
    this.setState({
      value: newContent
    });
    this.props.onChange(newContent.toString("html"));
  };

  render() {
    const { id, label, ...props } = this.props;
    const { value } = this.state;
    return (
      <div {...filterDOMProps(props)}>
        {label && <label htmlFor={id}>{label}</label>}
        <CKEditor
          activeClass="p10"
          content={value}
          events={{
            change: this.onChange
          }}
          config={{
            on: {
              pluginsLoaded: function() {
                const editor = this,
                  config = editor.config;

                editor.ui.addRichCombo("my-combo", {
                  label: "Select variables",
                  title: "Select variables",
                  toolbar: "basicstyles,0",

                  panel: {
                    css: [CKEDITOR.skin.getPath("editor")].concat(
                      config.contentsCss
                    ),
                    multiSelect: false,
                    attributes: { "aria-label": "Select variables" }
                  },

                  init: function() {
                    variablesEnum.map(data => {
                      this.add(data.value, data.label);
                    });
                  },

                  onClick: function(value) {
                    editor.focus();
                    editor.fire("saveSnapshot");

                    editor.insertHtml(`{${value}}`);

                    editor.fire("saveSnapshot");
                  }
                });
              }
            }
          }}
        />
      </div>
    );
  }
}

export default connectField(RichTextArea, {
  ensureValue: false,
  includeInChain: false
});
