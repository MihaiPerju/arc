import React, {Component} from 'react';
import classNames from "classnames";

export default class LetterTemplateSingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetTemplate() {
        const {template, setTemplate} = this.props;
        setTemplate(template._id);
    }

    onSelectTemplate(e) {
        e.stopPropagation();
        const {template, selectTemplate} = this.props;
        selectTemplate(template._id);
    }

    render() {
        const {template, templatesSelected, currentTemplate} = this.props;
        const checked = templatesSelected.includes(template._id);
        const classes = classNames({
            "list-item": true,
            "bg--yellow": checked,
            "open": currentTemplate === template._id
        });
        return (
            <div
                onClick={this.onSetTemplate.bind(this)}
                className={classes}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectTemplate.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{template.name}</div>
                </div>
            </div>
/*
import React, { Component } from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import { Table, Button, Dropdown, Label } from 'semantic-ui-react';

export default class LetterSingle extends Component {
    constructor () {
        super();
        autoBind(this);
    }

    deleteLetterTemplate () {
        Meteor.call('letterTemplate.delete', this.props.letterTemplate._id, (err) => {
            if (!err) {
                Notifier.success('Letter template deleted !');
                FlowRouter.reload();
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onEditLetterTemplate () {
        FlowRouter.go('/letter-template/:_id/edit', {_id: this.props.letterTemplate._id});
    }

    render () {
        const {letterTemplate} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{letterTemplate.name}</Table.Cell>
                <Table.Cell>
                    <div>
                        {_.map(letterTemplate.codes, (code, idx) => {
                            return <Label as='a' color='teal' tag>{code.code}</Label>;
                        })}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    <Dropdown button text='Action' icon={null} simple>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button primary onClick={this.onEditLetterTemplate}>Edit</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={this.deleteLetterTemplate}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
*/
        );
    }
}