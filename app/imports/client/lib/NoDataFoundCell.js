import React, {Component} from 'react';
import {Table} from 'semantic-ui-react'
import PropTypes from 'prop-types'


const NO_TEXT_FOUND = "Not found";

export default class NoDataFound extends Component {

    render() {
        const text = this.props.text || NO_TEXT_FOUND;
        const colSpan = this.props.colSpan || 1;

        return (
            <Table.Row>
                <Table.Cell className="no-data-found" textAlign='center' colSpan={colSpan}>{text}</Table.Cell>
            </Table.Row>
        );
    }
}

NoDataFound.propTypes = {
    text: PropTypes.string.isRequired,
    colSpan: PropTypes.number.isRequired,
}