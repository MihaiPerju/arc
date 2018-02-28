import React, {Component} from 'react';
import Notifier from "../../lib/Notifier";
import ClientSchema from "../../../api/clients/schemas/schema";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';

export default class CreateClient extends Component {
    constructor() {
        super();
        this.state = {
            newContact: false
        }
    }

    newContact = () => {
        this.setState({
            newContact: true
        })
    }

    closeNewCotact = () => {
        this.setState({
            newContact: false
        })
    }

    onSubmit(data) {
        Meteor.call('client.create', data, (err, userId) => {
            if (!err) {
                FlowRouter.go('/client/' + userId + '/edit');
                Notifier.success('Client added!');
            } else {
                Notifier.error(err.reason);
            }
        })
    }


    render() {
        const {newContact} = this.state;

        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add client</button>
                    <div className="btn-group">
                        <button className="btn-cancel">Cancel</button>
                        <button className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="action-block">
                    <div className="header__block">
                        <div className="title-block text-uppercase">Client information</div>
                    </div>
                </div>
                <AutoForm schema={ClientSchema} onSubmit={this.onSubmit.bind(this)} ref="form">

                    {
                        this.state.error
                            ?
                            <div className="error">{this.state.error}</div>
                            :
                            ''
                    }
                    <div className="form-wrapper">
                        <AutoField noLabel={true} placeholder="Client name" name="clientName"/>
                        <ErrorField name="clientName"/>
                    </div>

                    <div className="form-wrapper">
                        <AutoField noLabel={true} placeholder="Email" name="email"/>
                        <ErrorField name="email"/>
                    </div>
                    <button>
                        Continue
                    </button>
                </AutoForm>
                <form action="">

                    <div className="create-form__wrapper">
                        <div className="action-block">
                            <div className="header__block">
                                <div className="title-block text-uppercase">Client information</div>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Client name"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="First name"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Last name"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Email"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Region"/>
                            </div>
                        </div>
                        {
                            newContact && <NewContact close={this.closeNewCotact}/>
                        }
                        <div className="add-filter text-center" onClick={this.newContact}>+ Add contact</div>
                    </div>
                </form>
            </div>
        )
    }
}

class NewContact extends Component {
    render() {
        const {close} = this.props;

        return (
            <div className="action-block action-new-contact">
                <div className="header__block">
                    <div className="title-block text-uppercase">Contact information</div>
                </div>
                <div className="row__action">
                    <div className="type">Contact nr. 1</div>
                    <div className="btn-delete" onClick={close}>Delete</div>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Client name"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="First name"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Phone number"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Email"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Phone number"/>
                </div>
                <div className="form-wrapper">
                    <input type="text" placeholder="Email"/>
                </div>
                <div className="select-group">
                    <div className="form-wrapper">
                        <select name="filter">
                            <option value="">Contact Description</option>
                        </select>
                    </div>
                </div>
                <div className="form-wrapper">
                    <textarea placeholder="*Note"></textarea>
                </div>
            </div>
        )
    }
}