import synth from '../../synth';

import Slider from '../Slider/Slider';

import './EnvelopeSettings.css'

export default function EnvelopeSettings ({}) {

    function setEnvelopeAttackTime (attackTime) {
        synth.setEnvelopeAttackTime(attackTime);
    }

    function setEnvelopeReleaseTime (releaseTime) {
        synth.setEnvelopeReleaseTime(releaseTime);
    }

    return(
        <>
            <div className="dashboard-item-title">Envelope</div>
            <div className="dashboard-item-subtitle">Attack</div>
            <Slider setValue={setEnvelopeAttackTime} minValue={0} maxValue={1} units='s'/>
            <div className="dashboard-item-subtitle">Release</div>
            <Slider setValue={setEnvelopeReleaseTime} minValue={0} maxValue={1} units='s'/>
        </>
    );
}