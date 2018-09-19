import React, {Component} from 'react';
import RuleSingle from './RuleSingle';

export default class RulesList extends Component {
    render() {
        const {rules,setRule, selectRule, rulesSelected, currentRule} = this.props;
        const ruleList = rules.map(function (rule, index) {
            return (
                <RuleSingle
                    rulesSelected={rulesSelected}
                    currentRule={currentRule}
                    selectRule={selectRule}
                    setRule={setRule}
                    rule={rule}
                    key={rule._id}
                />
            )
        }, this);

        return (
            <div className={this.props.class}>
                {ruleList}
            </div>
        );
    }
}
