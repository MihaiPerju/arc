import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import Roles from '/imports/api/users/enums/roles';

export default class ReportSingle extends Component {
    deleteReport() {
        const {report} = this.props;
        Meteor.call('report.delete', report._id, (err) => {
            if (!err) {
                Notifier.success('Report deleted !');
                FlowRouter.reload();
            }
        });
    }

    isAllowedToEdit() {
        const user = Meteor.user();
        const {report} = this.props;
        return user.roles.includes(Roles.ADMIN) || user.roles.includes(Roles.TECH) || report.createdBy === Meteor.userId();
    }

    render() {
        const {report} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{report.name}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        {
                            this.isAllowedToEdit()
                            &&
                            <div>
                                <Button primary href={"/report/" + report._id + "/edit"}>Edit</Button>
                                <Button negative onClick={this.deleteReport.bind(this)}>Delete</Button>
                            </div>
                        }

                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}