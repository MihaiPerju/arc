import React from 'react';
import {Container} from 'semantic-ui-react';

const TaskData = ({task}) => {
    return (
        <Container>
            <table className='reportTable'>
                <tr>
                    <td className='reportTableCell'>AcctNum</td>
                    <td className='reportTableCell'>{task && task.acctNum}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>FacCode</td>
                    <td className='reportTableCell'>{task && task.facCode}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>PtType</td>
                    <td className='reportTableCell'>{task && task.ptType}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>PtName</td>
                    <td className='reportTableCell'>{task && task.ptName}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>DischrgDate</td>
                    <td className='reportTableCell'>{task && task.dischrgDate}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>FbDate</td>
                    <td className='reportTableCell'>{task && task.fbDate}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>AcctBal</td>
                    <td className='reportTableCell'> {task && task.acctBal}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>FinClass</td>
                    <td className='reportTableCell'>{task && task.finClass}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>AdmitDate</td>
                    <td className='reportTableCell'>{task && task.admitDate}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>MedNo</td>
                    <td className='reportTableCell'>{task && task.medNo}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsName</td>
                    <td className='reportTableCell'>{task && task.insName}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsName2</td>
                    <td className='reportTableCell'>{task && task.insName2}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsName3</td>
                    <td className='reportTableCell'>{task && task.insName3}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsCode</td>
                    <td className='reportTableCell'>{task && task.insCode}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsCode2</td>
                    <td className='reportTableCell'>{task && task.insCode2}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsCode3</td>
                    <td className='reportTableCell'>{task && task.insCode3}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsBal</td>
                    <td className='reportTableCell'>{task && task.insBal}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsBal2</td>
                    <td className='reportTableCell'>{task && task.insBal2}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>InsBal3</td>
                    <td className='reportTableCell'>{task && task.insBal3}</td>
                </tr>
                <tr>
                    <td className='reportTableCell'>State</td>
                    <td className='reportTableCell'>{task && task.state}</td>
                </tr>
            </table>
        </Container>
    )
};
export default TaskData;