import React from 'react';
import SimpleSchema from "simpl-schema";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';

export default class AccountTickle extends React.Component {
    render() {
        return (
            <div className="create-form">
                <div className="create-form__wrapper">
                    <div className="action-block">
                        <main className="cc-main">
                            <AutoForm onSubmit={this.tickle} schema={tickleSchema}>
                                <div className="filter-type__wrapper">
                                    <div className="input-datetime">
                                        <AutoField placeholder="Select tickle date" labelHidden={true}
                                                   name="tickleDate"/>
                                        <ErrorField name="tickleDate"/>
                                    </div>
                                </div>
                                <div className="btn-group">
                                    <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                                    <button type="submit" className="btn--light-blue">
                                        Confirm & send
                                    </button>
                                </div>
                            </AutoForm>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

const tickleSchema = new SimpleSchema({
    tickleDate: {
        type: Date
    }
});