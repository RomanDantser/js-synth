import { useEffect, useState } from 'react';
import synth from '../../synth/index';

import KeyPad from '../KeyPad/KeyPad';
import DashBoard from '../DashBoard/DashBoard';
import './SynthComponent.css';

export default function SynthComponent() {
    const [keysPressed, setKeysPressed] = useState([]);
    const [keyOnMouseClick, setKeyOnMouseClick] = useState(null);
    const startOctave = 0;

    const keyToKeyboardPosition = {
        'KeyA' : `C:${startOctave}`,
        'KeyW': `C#:${startOctave}`,
        'KeyS': `D:${startOctave}`,
        'KeyE': `D#:${startOctave}`,
        'KeyD': `E:${startOctave}`,
        'KeyF': `F:${startOctave}`,
        'KeyT': `F#:${startOctave}`,
        'KeyG': `G:${startOctave}`,
        'KeyY': `G#:${startOctave}`,
        'KeyH': `A:${startOctave}`,
        'KeyU': `A#:${startOctave}`,
        'KeyJ': `B:${startOctave}`,
        'KeyK': `C:${startOctave + 1}`,
        'KeyO': `C#:${startOctave + 1}`,
        'KeyL': `D:${startOctave + 1}`,
        'KeyP': `D#:${startOctave + 1}`,
        'Semicolon':`E:${startOctave + 1}`,
    };

    useEffect(() => {
        document.onkeydown = onKeyDown;
        document.onkeyup = onKeyUp;
    }, [keysPressed]);
    

    const onKeyDown = (event) => {
        const pushedKey = keyToKeyboardPosition[event.code];
        if(pushedKey !== undefined) {
            synth.onKeyPress(pushedKey);
            if(!keysPressed.includes(pushedKey)) {
                setKeysPressed([...keysPressed, pushedKey]);
            }
        }
    };

    const onKeyUp = (event) => {
        const releasedKey = keyToKeyboardPosition[event.code];
        if(releasedKey !== undefined) {
            synth.onKeyRelease(releasedKey);
            setKeysPressed(keysPressed.filter(key => key !== releasedKey))
        }
    };

    const onMouseDownOnKey = (event) => {
        const pushedKey = event.target.id;
        if(pushedKey !== undefined) {
            synth.onKeyPress(pushedKey);
            setKeyOnMouseClick(pushedKey);
            if(!keysPressed.includes(pushedKey)) {
                setKeysPressed([...keysPressed, pushedKey]);
            }
        }
    };

    const onMouseUpOnKey = () => {
        synth.onKeyRelease(keyOnMouseClick);
        setKeyOnMouseClick(null);
        setKeysPressed(keysPressed.filter(key => key !== keyOnMouseClick));
    };

    return (
        <div onKeyUp={onKeyUp} onMouseUp={onMouseUpOnKey} className='synth'>
            <DashBoard/>
            <KeyPad keysPressed={keysPressed} onMouseDownOnKey={onMouseDownOnKey}/>
        </div>
    );
}
