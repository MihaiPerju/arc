import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class ReportSingle extends Component {
    deleteReport() {
        const {report} = this.props;
        console.log(report);
        Meteor.call('report.delete', report._id, (err) => {
            if (!err) {
                Notifier.success('Report deleted !');
                FlowRouter.reload();
            }
        });
    }

    render() {
        const {report} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{report.name}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button primary href={"/report/" + report._id + "/edit"}>Edit</Button>
                        <Button negative onClick={this.deleteReport.bind(this)}>Delete</Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}