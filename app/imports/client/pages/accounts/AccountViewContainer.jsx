import React from 'react';
import TabSelect from '/imports/client/lib/TabSelect';
import AccountView from '/imports/client/pages/accounts/components/AccountView.jsx';
import LetterListContainer from '/imports/client/pages/letters/LetterListContainer.jsx';
import {Container} from 'semantic-ui-react';
import TABS from '/imports/client/pages/accounts/enums/tabs.js';

export default class AccountViewContainer extends React.Component {

    render() {
        const accountId = this.props._id;
        const tabOptions = [
            {
                label: TABS.VIEW_ACCOUNT,
                component: <AccountView accountId={accountId}/>,
            },
            {
                label: TABS.LETTERS,
                component: <LetterListContainer accountId={accountId}/>,
            }
        ];

        return (
            <Container className="page-container">
                <TabSelect options={tabOptions}/>
            </Container>
        );
    }
}
