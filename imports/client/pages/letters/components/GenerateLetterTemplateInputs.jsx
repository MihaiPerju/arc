import React from 'react';
import _ from "underscore";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import taskAttachmentsQuery from '/imports/api/tasks/queries/taskAttachmentsList';
import SelectMulti from '/imports/client/lib/uniforms/SelectMulti.jsx';
import TaskViewService from '/imports/client/pages/tasks/services/TaskViewService';

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
        const {templateKeywords} = nextProps;

        this.setState({
            schema: this.generateSchema(templateKeywords ? templateKeywords : [])
        });

        taskAttachmentsQuery.clone({_id: this.props.taskId}).fetchOne((err, data) => {
            if (!err) {
                this.setState({
                    pdfAttachments: data.attachments
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
        options.forEach((opt) => {
            schema[opt] = {
                type: String,
                optional: true
            };
        });

        schema['attachmentIds'] = {
            label: 'Pdf attachments:',
            type: Array,
            optional: true
        };
        schema['attachmentIds.$'] = {
            type: String
        };

        return new SimpleSchema(schema);
    }

    generateFields() {
        const {templateKeywords} = this.props;

        if (templateKeywords) {
            const fields = [];

            templateKeywords.forEach((keyword, index) => {
                fields.push(
                    <div className="form-group">
                        <AutoField
                            key={index}
                            name={keyword}
                            placeholder={keyword}
                        />
                    </div>,
                    <ErrorField key={keyword + index} name={keyword}/>,
                );
            });

            return fields;
        }
    }

    onSubmit = (data) => {
        this.props.onChange(data);
    };


    getAttachmentOptions = (enums) => {
        return _.map(enums, (value, key) => {
            return {value: value._id, label: TaskViewService.getPdfName(value)};
        });
    };

    render() {
        const {schema} = this.state;
        const fields = this.generateFields();
        const {templateKeywords} = this.props;
        const {pdfAttachments, selectedAttachments} = this.state;
        const attachmentOptions = this.getAttachmentOptions(pdfAttachments);

        if (!templateKeywords || !templateKeywords.length) {
            return <div/>;
        }

        return (
            <div>
                <AutoForm autosave
                          schema={schema}
                          onSubmit={this.submit}>

                    <SelectMulti name="attachmentIds" options={attachmentOptions}/>
                    <ErrorField name="attachmentIds"/>

                    {fields}
                </AutoForm>
            </div>
        );
    }
}