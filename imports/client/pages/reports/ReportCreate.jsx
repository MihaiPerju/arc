import React from 'react';
import {Container, Header, Divider, Button} from 'semantic-ui-react'
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import schema from '/imports/api/reports/schema'

export default class ReportCreate extends React.Component {
    constructor() {
        super();

        this.state = {
            error: null
        };
    }

    onSubmit(data) {
        console.log(data);
    }

    render() {
        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Create report</Header>

                    <AutoForm schema={schema} onSubmit={this.onSubmit.bind(this)} ref="form">
                        {this.state.error
                            ? <div className="error">{this.state.error}</div>
                            : ''
                        }

                        <AutoField name="name"/>
                        <ErrorField name="name"/>

                        <SelectField name="allowedRoles"
                                     options={
                                         [
                                             {label: 1, value: 1},
                                             {label: 2, value: 2},
                                             {label: 3, value: 3},
                                         ]
                                     }/>


                        <Divider/>

                        <Button primary fluid type="submit">
                            Create
                        </Button>
                    </AutoForm>
                </div>
            </Container>
        )
    }
}