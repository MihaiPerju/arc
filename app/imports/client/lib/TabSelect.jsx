import React from 'react';
import PropTypes from 'prop-types';
import {Tab} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class TabSelect extends React.Component {
    constructor() {
        super();
        this.state = {
            activeTab: 0
        };
    }

    onChangeActiveTab = (index, data) => {
        this.setState({
            activeTab: data.activeIndex
        });
    };

    render() {
        const {options, header} = this.props;
        const {activeTab} = this.state;

        const panes = options.map((tab) => {
            return {
                menuItem: tab.label,
                render: () => <Tab.Pane>
                    <Header as="h2" textAlign="center">{header ? header : null}</Header>
                    {
                        (options[activeTab].component)
                    }
                </Tab.Pane>
            }
        });

        return (
            <Tab onTabChange={this.onChangeActiveTab} panes={panes}/>
        )
    }
}

TabSelect.propTypes = {
    options: PropTypes.array,
    onChangeActiveTab: PropTypes.func
};