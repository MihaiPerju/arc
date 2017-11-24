import React from 'react';
import TabSelect from '/imports/client/lib/TabSelect';
import TaskView from '/imports/client/pages/tasks/components/TaskView.jsx';
import Letter from '/imports/client/pages/letters/LetterCreate.jsx';
import {Container} from 'semantic-ui-react';
import TABS from '/imports/client/pages/tasks/enums/tabs.js';

export default class TaskViewContainer extends React.Component {

    render() {
        const taskId = this.props._id;
        const tabOptions = [
            {
                label: TABS.VIEW_TASK,
                component: <TaskView taskId={taskId}/>,
            },
            {
                label: TABS.LETTER,
                component: <Letter taskId={taskId}/>,
            },
        ];

        return (
            <Container className="page-container">
                <TabSelect options={tabOptions}/>
            </Container>
        );
    }
}
