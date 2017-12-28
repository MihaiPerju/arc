import React from 'react';
import {Container, Table, Label} from 'semantic-ui-react';

const TaskData = ({task}) => {
    return (
        <Container>
            <Table textAlign="center" celled>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>AcctNum</Table.Cell>
                        <Table.Cell>{task && task.acctNum}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>FacCode</Table.Cell>
                        <Table.Cell>{task && task.facCode}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>PtType</Table.Cell>
                        <Table.Cell>{task && task.ptType}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>PtName</Table.Cell>
                        <Table.Cell>{task && task.ptName}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>DischrgDate</Table.Cell>
                        <Table.Cell>{task && task.dischrgDate}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>FbDate</Table.Cell>
                        <Table.Cell>{task && task.fbDate}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>AcctBal</Table.Cell>
                        <Table.Cell> {task && task.acctBal}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>FinClass</Table.Cell>
                        <Table.Cell>{task && task.finClass}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>AdmitDate</Table.Cell>
                        <Table.Cell>{task && task.admitDate}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>MedNo</Table.Cell>
                        <Table.Cell>{task && task.medNo}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsName</Table.Cell>
                        <Table.Cell>{task && task.insName}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsName2</Table.Cell>
                        <Table.Cell>{task && task.insName2}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsName3</Table.Cell>
                        <Table.Cell>{task && task.insName3}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsCode</Table.Cell>
                        <Table.Cell>{task && task.insCode}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsCode2</Table.Cell>
                        <Table.Cell>{task && task.insCode2}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsCode3</Table.Cell>
                        <Table.Cell>{task && task.insCode3}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsBal</Table.Cell>
                        <Table.Cell>{task && task.insBal}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsBal2</Table.Cell>
                        <Table.Cell>{task && task.insBal2}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsBal3</Table.Cell>
                        <Table.Cell>{task && task.insBal3}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>State</Table.Cell>
                        <Table.Cell>{task && task.state}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Container>
    )
};
export default TaskData;