import React from 'react';
import RegionSchema from '/imports/api/regions/schemas/schema';
import { AutoForm, AutoField, ErrorField } from '/imports/ui/forms';
import Notifier from '/imports/client/lib/Notifier';
import { Container } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Divider } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';

export default class RegionEdit extends React.Component {
    constructor () {
        super();

        this.state = {
            error: null
        };
    }



    onSubmit (data) {
        data.clientId = FlowRouter.current().params.id;
        Meteor.call('region.update', data, (err) => {
            if (!err) {
                Notifier.success('Region Updated');
                this.onClose();
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onCreateRegion = () => {
        const {form} = this.refs;
        form.submit();
    }

    onClose = () => {
        const {close} = this.props;
        close();
    };

    render () {
        const {region} = this.props;
        const schema = RegionSchema.omit('clientId');

        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add region</button>
                    <div className="btn-group">
                        <button
                            onClick={this.onClose} className="btn-cancel">Cancel</button>
                        <button onClick={this.onCreateRegion} className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block i--block">
                        <AutoForm model={region} schema={schema} onSubmit={this.onSubmit.bind(this)} ref="form">
                            {this.state.error && <div className="error">{this.state.error}</div>}
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Name" name="name"/>
                                <ErrorField name="name"/>
                            </div>
                        </AutoForm>
                    </div>
                </div>
            </div>
        )
    }
}