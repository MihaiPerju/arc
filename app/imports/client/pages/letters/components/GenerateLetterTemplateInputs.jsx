import React from "react";
import _ from "underscore";
import {
  AutoForm,
  AutoField,
  SelectField,
  ErrorField
} from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import taskAttachmentsQuery from "/imports/api/tasks/queries/taskAttachmentsList";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import TaskViewService from "/imports/client/pages/tasks/services/TaskViewService";
import { variablesEnum } from "/imports/api/letterTemplates/enums/variablesEnum";
import PdfAttachments from "./PdfAttachments";

export default class GenerateLetterTemplateInputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schema: this.generateSchema(),
      pdfAttachments: [],
      selectedAttachments: []
    };
    this.submit = _.debounce(this.onSubmit, 300);
  }

  componentWillReceiveProps(nextProps) {
    const { templateKeywords } = nextProps;

    this.setState({
      schema: this.generateSchema(templateKeywords ? templateKeywords : [])
    });

    taskAttachmentsQuery
      .clone({ _id: this.props.taskId })
      .fetchOne((err, data) => {
        if (!err) {
          pdfAttachments = [{ name: "Select Attachment" }];
          pdfAttachments = pdfAttachments.concat(data.attachments);
          this.setState({
            pdfAttachments
          });
        } else {
          Notifier.error(err.reason);
        }
      });
  }

  generateSchema(options) {
    let schema = {};
    if (!options || !options.length) {
      return new SimpleSchema(schema);
    }
    options.forEach(opt => {
      if (variablesEnum[opt]) {
        schema[variablesEnum[opt].field] = {
          type: String,
          optional: true
        };
      } else {
        schema[opt] = {
          type: String,
          optional: true
        };
      }
    });

    schema["attachmentIds"] = {
      label: "Pdf attachments",
      type: String
    };

    return new SimpleSchema(schema);
  }

  generateFields() {
    const { templateKeywords } = this.props;
    if (templateKeywords) {
      const fields = [];

      templateKeywords.forEach((keyword, index) => {
        if (variablesEnum[keyword]) {
          fields.push(
            <div className="form-group">
              <AutoField
                key={index}
                name={variablesEnum[keyword].field}
                placeholder={keyword}
              />
            </div>
          );
        } else {
          fields.push(
            <div className="form-group">
              <AutoField key={index} name={keyword} placeholder={keyword} />
            </div>
          );
        }
      });
      return fields;
    }
  }

  onSubmit = data => {
    this.props.onChange(data);
  };

  getAttachmentIndex = (attachments, attachmentId) => {
    for (index in attachments) {
      if (attachments[index]._id === attachmentId) {
        //Got the index of selected attachment
        return index;
      }
    }
  };

  swapAttachment = (arrSource, arrDest, elementId) => {
    console.log(arrSource, arrDest, elementId);
    const index = this.getAttachmentIndex(arrSource, elementId);
    const newElement = arrSource[index];
    arrDest.push(newElement);
    arrSource.splice(index, 1);
    return { arrSource, arrDest };
  };

  onSelectAttachment = attachmentId => {
    const { selectedAttachments, pdfAttachments } = this.state;
    const { arrSource, arrDest } = this.swapAttachment(
      pdfAttachments,
      selectedAttachments,
      attachmentId
    );
    this.setState({
      pdfAttachments: arrSource,
      selectedAttachments: arrDest
    });
  };

  onRemoveAttachment = attachmentId => {
    console.log(this.state);
    const { pdfAttachments, selectedAttachments } = this.state;
    const { arrSource, arrDest } = this.swapAttachment(
      selectedAttachments,
      pdfAttachments,
      attachmentId
    );
    this.setState({
      selectedAttachments: arrSource,
      pdfAttachments: arrDest
    });
  };

  getAttachmentOptions = enums => {
    return _.map(enums, (value, key) => {
      return { value: value._id, label: TaskViewService.getPdfName(value) };
    });
  };

  render() {
    const { schema } = this.state;
    const fields = this.generateFields();
    const { templateKeywords, account } = this.props;
    const { pdfAttachments, selectedAttachments } = this.state;
    const attachmentOptions = this.getAttachmentOptions(pdfAttachments);
    if (!templateKeywords || !templateKeywords.length) {
      return <div />;
    }

    return (
      <div>
        {schema && (
          <AutoForm
            autosave
            schema={schema}
            model={account}
            onSubmit={this.submit}
          >
            <SelectField
              className="select-helper"
              name="attachmentIds"
              options={attachmentOptions}
              onChange={this.onSelectAttachment}
            />
            <PdfAttachments
              onRemoveAttachment={this.onRemoveAttachment}
              attachments={selectedAttachments}
            />

            <ErrorField name="attachmentIds" />

            {fields}
          </AutoForm>
        )}
      </div>
    );
  }
}
