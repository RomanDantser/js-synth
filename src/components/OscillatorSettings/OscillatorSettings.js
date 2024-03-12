import synth from '../../synth/index';

import Select from '../Select/Select.js';
import Slider from '../Slider/Slider.js';

import './OscillatorSettings.css';

export default function OscillatorSettings ({}) {

    function setWaveType (waveType) {
        synth.setOscillatorWaveType(waveType);
    }

    return (
        <>
            <div className="dashboard-item-title">Oscillators</div>
            <div className='dashboard-item-subtitle'>Wave Type</div>
            <Select
                defaultValue={synth.oscillatorSettings.waveType}
                selectItems={synth.allowedWaveTypes}
                setValue={setWaveType}
            />
            <div className='dashboard-item-subtitle'>Detune (under dev, not working)</div>
            <Slider />
        </>
    );
}