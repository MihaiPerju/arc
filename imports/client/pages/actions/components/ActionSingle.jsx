import React, {Component} from 'react';
import classNames from "classnames";

export default class ActionSingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetAction() {
        const {action, setAction} = this.props;
        setAction(action._id);
    }

    onSelectAction(e) {
        e.stopPropagation();
        const {action, selectAction} = this.props;
        selectAction(action._id);
    }

    manageCodes = () => {
        const {action, reasonCodesManage} = this.props;
        reasonCodesManage(action._id);
    }

    render() {
        const {action, actionsSelected, currentAction} = this.props;
        const checked = actionsSelected.includes(action._id);
        const classes = classNames({
            "list-item": true,
            "bg--yellow": checked,
            "open": currentAction === action._id
        });

        return (
            <div
                onClick={this.onSetAction.bind(this)}
                className={classes}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectAction.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{action.title}</div>
                </div>
            </div>
/*
            <Table.Row>
                <Table.Cell>{action.title}</Table.Cell>
                <Table.Cell>{action.description}</Table.Cell>
                <Table.Cell>{LabelSubstates[action.substate]}</Table.Cell>
                <Table.Cell>
                    <Dropdown button text='Action' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button onClick={this.onEditAction}>Edit</Button> 
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={this.deleteAction}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
                <Table.Cell>
                    <Button color="green" onClick={this.manageCodes}>Manage Reason Codes</Button>
                </Table.Cell>
            </Table.Row>
*/
        );
    }
}