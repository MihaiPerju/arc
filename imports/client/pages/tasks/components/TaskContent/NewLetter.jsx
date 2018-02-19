import React, {Component} from 'react';
import query from '/imports/api/letterTemplates/queries/listLetterTemplates';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';
import {getImagePath} from '/imports/api/utils';
import {AutoForm, SelectField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import LetterCreateContainer from '/imports/client/pages/letters/LetterCreateContainer.jsx';

class NewLetter extends Component {
    constructor() {
        super();
        this.state = {
            fade: false,
            selectedTemplate: {}
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 1);
    }

    getOptions = (data) => {
        return _.map(data, (letterTemplate) => ({
            value: letterTemplate._id,
            label: letterTemplate.name
        }));
    };

    getLetterTemplate(value) {
        const {data} = this.props;
        for (letterTemplate of data) {
            if (letterTemplate._id === value) {
                return letterTemplate;
            }
        }
    }

    onHandleChange(label, value) {
        const selectedTemplate = this.getLetterTemplate(value);
        this.setState({selectedTemplate});
    }

    render() {
        const {data, isLoading, error, task} = this.props;
        const {selectedTemplate} = this.state;
        const {avatar} = Meteor.user();
        const {profile} = Meteor.user();
        const options = this.getOptions(data);

        if (isLoading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <div className={this.state.fade ? "new-letter in" : "new-letter"}>
                <div className="row-block">
                    <div className="info">
                        <img className="md-avatar img-circle"
                             src={avatar ? getImagePath(avatar.path) : "/assets/img/user1.svg"} alt=""/>
                        <div className="name">{profile.firstName + " " + profile.lastName}</div>
                    </div>
                    <div className="form-group">
                        <AutoForm onChange={this.onHandleChange.bind(this)} schema={schema}>
                            <SelectField
                                name="selectedOption"
                                placeholder="Select letter"
                                options={options}/>
                        </AutoForm>
                        <button className="btn--red">Cancel</button>
                    </div>
                </div>

                <LetterCreateContainer selectedTemplate={selectedTemplate}
                                       taskId={task && task._id}
                                       data={data}/>
            </div>
        )
    }
}

const schema = new SimpleSchema({
    selectedOption: {
        type: String,
        label: false
    }
});

export default withQuery(() => {
    return query.clone();
})(NewLetter)