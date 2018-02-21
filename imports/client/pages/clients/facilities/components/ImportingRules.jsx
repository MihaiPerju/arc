import React from 'react';
import {AutoForm, AutoField, ErrorField, RadioField, ListField, ListItemField, NestField} from 'uniforms-semantic';
import Notifier from '/imports/client/lib/Notifier';
import PropTypes from 'prop-types';
import {Container, Divider, Button, Segment} from 'semantic-ui-react'
import RulesService from '/imports/client/pages/clients/facilities/services/ImportingRulesService';
import Loading from '/imports/client/lib/ui/Loading';

export default class ImportingRules extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true
        }
    }

    componentWillMount() {
        const {model} = this.props;
        const schema = RulesService.createSchema(model && model.importRules && model.importRules.hasHeader);
        this.setState({
            loading: false,
            schema
        });
    }

    onSubmitImportingRules = (importRules) => {
        const facilityId = this.props.model._id;

        Meteor.call('facility.update', {_id: facilityId, importRules}, (err) => {
            if (!err) {
                Notifier.success("Facility updated!");
                this.props.updateFacility();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    onChange(field, value) {
        if (field === 'hasHeader') {
            //Change schema
            const newSchema = RulesService.createSchema(value);

            this.setState({
                schema: newSchema
            })
        }
    }

    render() {
        const {schema, loading} = this.state;
        const fields = RulesService.getSchemaFields();
        const {model} = this.props;
        console.log(schema);
        const options = [{value: true, label: 'True'}, {value: false, label: 'False'}];

        return (
            <Container>
                {
                    loading ?
                        <Loading/> :
                        <AutoForm model={model.importRules} schema={schema}
                                  onChange={this.onChange.bind(this)}
                                  onSubmit={this.onSubmitImportingRules}>

                            <RadioField name="hasHeader" options={options}/>
                            <ErrorField name="hasHeader"/>

                            {
                                fields && fields.map((field, index) => {
                                    if (field !== 'insurances')
                                        return (
                                            <div key={index}>
                                                <AutoField name={field}/>
                                                <ErrorField name={field}/>
                                            </div>
                                        )
                                })
                            }
                            <ListField name="insurances">
                                <ListItemField name="$">
                                    <NestField>
                                        <Segment>
                                            <AutoField name="insName"/>
                                            <ErrorField name="insName"/>

                                            <AutoField name="insCode"/>
                                            <ErrorField name="insCode"/>

                                            <AutoField name="insBal"/>
                                            <ErrorField name="insBal"/>
                                        </Segment>
                                    </NestField>
                                </ListItemField>
                            </ListField>
                            <Divider/>
                            <Button primary fluid type="submit">Submit</Button>
                        </AutoForm>
                }
            </Container>
        )
    }
}

ImportingRules.propTypes = {
    model: PropTypes.object
};