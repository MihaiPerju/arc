import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {LabelSubstates} from '/imports/api/accounts/enums/substates'

const NO_TEXT_FOUND = "Not found";

export default class NoDataFound extends Component {

    render() {
        text = this.props.text || NO_TEXT_FOUND;
        colSpan = this.props.colSpan || 1;

        return (
            <Table.Row>
                <Table.Cell className="no-data-found" textAlign='center' colSpan={colSpan}>{text}</Table.Cell>
            </Table.Row>
        );
    }
}
