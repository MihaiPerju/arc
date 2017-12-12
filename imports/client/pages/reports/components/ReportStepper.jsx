import React from 'react';
import {Step} from 'semantic-ui-react'

export default class ReportStepper extends React.Component {
    render() {
        const {hasGeneralInformation} = this.props;
        return (
            <Step.Group ordered>
                <Step completed={hasGeneralInformation} active={!hasGeneralInformation}>
                    <Step.Content>
                        <Step.Title>General data</Step.Title>
                        <Step.Description>Select general data for report</Step.Description>
                    </Step.Content>
                </Step>

                <Step active={hasGeneralInformation}>
                    <Step.Content>
                        <Step.Title>Filters</Step.Title>
                        <Step.Description>Create filters for report</Step.Description>
                    </Step.Content>
                </Step>
            </Step.Group>
        )
    }
}