import React from 'react';
import {Container, Table} from 'semantic-ui-react';
import moment from "moment/moment";

const AccountData = ({account}) => {
    return (
        <Container>
            <Table textAlign="center" celled>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>AcctNum</Table.Cell>
                        <Table.Cell>{account && account.acctNum}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>FacCode</Table.Cell>
                        <Table.Cell>{account && account.facCode}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>PtType</Table.Cell>
                        <Table.Cell>{account && account.ptType}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>PtName</Table.Cell>
                        <Table.Cell>{account && account.ptName}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>DischrgDate</Table.Cell>
                        <Table.Cell>{account && moment(account.dischrgDate).format('MM/DD/YYYY')}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>FbDate</Table.Cell>
                        <Table.Cell>{account && moment(account.fbDate).format('MM/DD/YYYY')}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>AcctBal</Table.Cell>
                        <Table.Cell> {account && account.acctBal}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>FinClass</Table.Cell>
                        <Table.Cell>{account && account.finClass}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>AdmitDate</Table.Cell>
                        <Table.Cell>{account && moment(account.admitDate).format('MM/DD/YYYY')}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>MedNo</Table.Cell>
                        <Table.Cell>{account && account.medNo}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsName</Table.Cell>
                        <Table.Cell>{account && account.insName}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsName2</Table.Cell>
                        <Table.Cell>{account && account.insName2}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsName3</Table.Cell>
                        <Table.Cell>{account && account.insName3}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsCode</Table.Cell>
                        <Table.Cell>{account && account.insCode}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsCode2</Table.Cell>
                        <Table.Cell>{account && account.insCode2}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsCode3</Table.Cell>
                        <Table.Cell>{account && account.insCode3}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsBal</Table.Cell>
                        <Table.Cell>{account && account.insBal}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsBal2</Table.Cell>
                        <Table.Cell>{account && account.insBal2}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>InsBal3</Table.Cell>
                        <Table.Cell>{account && account.insBal3}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>State</Table.Cell>
                        <Table.Cell>{account && account.state}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Container>
    )
};
export default AccountData;