import React from 'react';
import {Header, Button} from 'semantic-ui-react';
import {Container} from 'semantic-ui-react';
import {LabelSubstates} from '/imports/api/accounts/enums/substates';
import AccountData from './AccountData';
import SortableTab from './SortableTab';
import {getToken} from '/imports/api/s3-uploads/utils';

const AccountDetails = ({account, updateAccount}) => {
    const actionsPerformed = account.actions;
    return (
        <Container className="page-container">
            <Header as="h3" textAlign="center">View Account</Header>
            <AccountData account={account}/>

            <h5>Substate: {account && LabelSubstates[account.substate]}</h5>
            {account && actionsPerformed && actionsPerformed.length
                ?
                <Container>
                    <h4>Actions</h4>
                    <ul>
                        {actionsPerformed.sort((a, b) => a.createdAt < b.createdAt).map((actionPerformed, key) => (
                            <li key={key}><b>{actionPerformed.action.title}</b> Reason: {actionPerformed.reasonCode}</li>
                        ))}
                    </ul>
                </Container>
                :
                <div>
                    <h4>No Actions</h4>
                </div>
            }
            <Header as="h3" textAlign="center">PDF Files</Header>
            <SortableTab updateAccount={updateAccount} attachments={account && account.attachments}/>
        </Container>)
};

export default AccountDetails;