import React, {Component} from 'react';
import LetterTemplateSingle from './LetterTemplateSingle';

export default class LetterTemplatesList extends Component {
    render() {
        const {templates} = this.props;
        const letterList = templates.map(function (template, index) {
            const {setTemplate, selectTemplate, templatesSelected, currentTemplate} = this.props;
            return (
                <LetterTemplateSingle
                    templatesSelected={templatesSelected}
                    currentTemplate={currentTemplate}
                    selectTemplate={selectTemplate}
                    setTemplate={setTemplate}
                    template={template}
                    key={index}
                />
            )
        }, this);

        return (
            <div className={this.props.class}>
                {letterList}
            </div>
/*
            <Container className="m-t-30">
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>CARC/RARC codes</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {
                        data.length
                            ?
                            <Table.Body>

                                {_.map(data, (letterTemplate, idx) => {
                                    return <LetterTemplateSingle letterTemplate={letterTemplate} key={idx}/>;
                                })}
                            </Table.Body>
                            :
                            <Table.Body>
                                <NoDataFoundCell colSpan="100"/>
                            </Table.Body>
                    }
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='100'>
                            <Button href='/letter-template/create' floated='left' icon labelPosition='left' primary size='small'>
                                <Icon name='plus' /> Create
                            </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Container>
*/
        );
    }
}
