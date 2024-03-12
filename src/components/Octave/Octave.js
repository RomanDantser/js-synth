import './Octave.css'

export default function Octave({ keysPressed, octaveIndex, onMouseDownOnKey}) {
    const whiteKeysMap = {
        0: 'C',
        1: 'D',
        2: 'E',
        3: 'F',
        4: 'G',
        5: 'A',
        6: 'B'
    };
    const blackKeysMap = {
        0: 'C#',
        1: 'D#',
        2: 'F#',
        3: 'G#',
        4: 'A#',
    };

    return (
        <div className="octave">
            <div className="white-keys">
                {new Array(7).fill(0).map((x, i) => {
                    const keyId = `${whiteKeysMap[i]}:${octaveIndex}`;
                    return <div
                        key={i}
                        id={keyId}
                        className={keysPressed.includes(keyId) ? 'white-key key-pressed' : 'white-key'}
                        onMouseDown={onMouseDownOnKey}
                    />;
                })}      
            </div>
            <div className='black-keys'>
                {new Array(5).fill(0).map((x, i) => {
                    const keyId = `${blackKeysMap[i]}:${octaveIndex}`;
                    return <div
                    key={i}
                    id={keyId}
                    className={keysPressed.includes(keyId) ? 'black-key key-pressed' : 'black-key'}
                    onMouseDown={onMouseDownOnKey}
                    />;
                })}     
            </div>
        </div>
    );
}