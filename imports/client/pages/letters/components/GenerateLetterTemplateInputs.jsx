import React from 'react';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';

export default class GenerateLetterTemplateInputs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            schema: this.generateSchema()
        };
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
                    <AutoField
                        key={index}
                        name={keyword}
                    />,
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

        return (
            <div>
                <AutoForm autosave
                          schema={schema}
                          onSubmit={this.onSubmit}>
                    {fields}
                </AutoForm>
            </div>
        );
    }
}