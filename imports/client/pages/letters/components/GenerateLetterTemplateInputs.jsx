import React from 'react';
import _ from "underscore";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';

export default class GenerateLetterTemplateInputs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            schema: this.generateSchema()
        };
        this.submit = _.debounce(this.onSubmit, 300);
    }

    componentWillReceiveProps(nextProps) {
        const {templateKeywords} = nextProps;

        this.setState({
            schema: this.generateSchema(templateKeywords ? templateKeywords : [])
        })
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

    render() {
        const {schema} = this.state;
        const fields = this.generateFields();
        const {templateKeywords} = this.props;

        if (!templateKeywords || !templateKeywords.length) {
            return <div/>;
        }

        return (
            <div>
                <AutoForm autosave
                          schema={schema}
                          onSubmit={this.submit}>
                    {fields}
                </AutoForm>
            </div>
        );
    }
}