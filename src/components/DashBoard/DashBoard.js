import EnvelopeSettings from '../EnvelopeSettings/EnvelopeSettings';
import MasterSettings from '../MasterSettings/MasterSettings';
import OscillatorSettings from '../OscillatorSettings/OscillatorSettings';

import './DashBoard.css';

export default function DashBoard() {
    return (
        <div className='dashboard'>
            <div className='dashboard-item'><MasterSettings /></div>
            <div className='dashboard-item'><OscillatorSettings /></div>
            <div className='dashboard-item'><EnvelopeSettings /></div>
            <div className='dashboard-item'>test</div>
            <div className='dashboard-item'>test</div>
            <div className='dashboard-item'>test</div>
        </div>
    )
}