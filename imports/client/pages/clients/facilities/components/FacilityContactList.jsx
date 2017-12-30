import React from 'react';
import {AutoField, ErrorField, LongTextField, ListField, ListItemField, NestField} from 'uniforms-semantic';
import {Segment} from 'semantic-ui-react'

export default class FacilityContactList extends React.Component {
    render() {
        return (
            <div>
                <ListField name="contacts">
                    <ListItemField name="$">
                        <NestField>
                            <Segment>
                                <AutoField name="firstName"/>
                                <ErrorField name="firstName"/>

                                <AutoField name="lastName"/>
                                <ErrorField name="lastName"/>

                                <AutoField name="phone"/>
                                <ErrorField name="phone"/>

                                <AutoField name="email"/>
                                <ErrorField name="email"/>

                                <AutoField name="contactDescription"/>
                                <ErrorField name="contactDescription"/>

                                <LongTextField name="notes"/>
                                <ErrorField name="notes"/>
                            </Segment>
                        </NestField>
                    </ListItemField>
                </ListField>
            </div>
        );
    }
}