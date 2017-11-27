import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class RegionSingle extends Component {
    constructor() {
        super();
        autoBind(this);
    }

    deleteRegion() {
        Meteor.call('region.delete', this.props.region._id, (err) => {
            if (!err) {
                Notifier.success('Region deleted !');
                FlowRouter.reload();
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onEditRegion() {
        FlowRouter.go("/region/:id/edit", {id: this.props.region._id});
    }

    render() {
        const {region} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{region.name}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button primary onClick={this.onEditRegion}>Edit</Button>
                        <Button color="red" onClick={this.deleteRegion}>Delete</Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}