import React from 'react';
import LetterTemplateSchema from '/imports/api/letterTemplates/schemas/schema';
import Notifier from '/imports/client/lib/Notifier';
import {AutoForm, AutoField, ErrorField, SelectField, LongTextField} from '/imports/ui/forms';
import RichTextArea from '/imports/client/lib/uniforms/RichTextArea.jsx';
import codesQuery from '/imports/api/codes/queries/listCodeNames';
import { CategoryList } from '/imports/api/letterTemplates/enums/categories.js';
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";

export default class EditLetterTemplate extends React.Component {
    constructor () {
        super();

        this.state = {
            error: null,
            codes: []
        };
    }

    componentWillMount () {
        codesQuery.clone({}).fetch((err, codes) => {
            if (!err) {
                this.setState({
                    codes
                });
            } else {
                Notifier.error('Couldn\'t get carc/rarc codes');
            }
        });

    }

    getCategories = (categories) => {
        return categories.map((category, key) => ({value: category, label: category}));
    };

    onSubmit = (data) => {
        Meteor.call('letterTemplate.update', data, (err) => {
            if (!err) {
                Notifier.success('Letter template updated');
                this.onClose();
            } else {
                Notifier.error(err.reason);
            }
        });
    };

    onCreate = () => {
        const {form} = this.refs;
        form.submit();
    };

    onClose = () => {
        const {close} = this.props;
        close();
    };

    getCodeOptions (codes) {
        return _.map(codes, ({_id, code}) => {
            return {value: _id, label: code};
        })
    }

    render () {
        const {model} = this.props;
        //const codeIds = this.getCodeOptions(this.state.codes);
        const categories = this.getCategories(CategoryList);

        return (
            <div className="create-form letter-template-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add letter template</button>
                    <div className="btn-group">
                        <button onClick={this.onClose} className="btn-cancel">Cancel</button>
                        <button onClick={this.onCreate} className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block i--block">
                        <AutoForm model={model} schema={LetterTemplateSchema} onSubmit={this.onSubmit} ref="form">
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} type="text" placeholder="Letter name" name="name"/>
                                <ErrorField name="name"/>
                            </div>
                            <div className="form-wrapper">
                                <LongTextField labelHidden={true} placeholder="Description" name="description"/>
                            </div>
                            <div className="form-wrapper rich-text-area">
                                <RichTextArea value={model.body} name="body"/>
                                <ErrorField name="body"/>
                            </div>
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <SelectField name="category" placeholder="Category" options={categories}/>
                                    <ErrorField name="category"/>
                                </div>
                            </div>
                        </AutoForm>
                    </div>
                </div>
            </div>
        )
    }
}