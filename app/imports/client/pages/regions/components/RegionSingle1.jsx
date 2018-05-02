import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table} from 'semantic-ui-react'
import {Button, Dropdown} from 'semantic-ui-react'

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
                    <Dropdown button text='Action' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button primary onClick={this.onEditRegion}>Edit</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={this.deleteRegion}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>  
                </Table.Cell>
            </Table.Row>
        );
    }
}