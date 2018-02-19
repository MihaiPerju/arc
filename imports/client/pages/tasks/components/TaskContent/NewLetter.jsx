import React, {Component} from 'react';
import query from '/imports/api/letterTemplates/queries/listLetterTemplates';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';
import {getImagePath} from '/imports/api/utils';
import {AutoForm, SelectField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';

class NewLetter extends Component {
    constructor() {
        super();
        this.state = {
            fade: false
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
        const letterTemplate = this.getLetterTemplate(value)
        console.log(letterTemplate);
    }

    render() {
        const {data, isLoading, error} = this.props;
        if (isLoading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        const {avatar} = Meteor.user();
        const {profile} = Meteor.user();
        const options = this.getOptions(data);
        console.log(options);
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
                <form action="" className="letter-template">
                    <div className="left-col">
                        <div className="form-group">
                            <input type="text" placeholder="Company name"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Company addr block"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Letter date"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Addr block"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="First name"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Second name"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Signature"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Title"/>
                        </div>
                    </div>
                    <div className="right-col">
                        <p>Dear Mr. John,</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id porro eum, ducimus.
                            Neque saepe dolorem perferendis eos nihil. Accusamus atque, dolore qui praesentium doloribus
                            reiciendis laudantium,
                            quibusdam beatae! Dolore, magnam.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        <p>Sincerily</p>
                        <button className="btn--green btn-save">Save</button>
                    </div>
                </form>
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