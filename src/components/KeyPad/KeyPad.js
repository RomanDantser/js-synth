import Octave from "../Octave/Octave";
import './KeyPad.css';

export default function KeyPad({ keysPressed, onMouseDownOnKey}) {
    const numOfOctaves = 5;
    const startingPoint = -Math.floor(numOfOctaves / 2);

    return (
        <div className="key-pad">
            {new Array(numOfOctaves).fill(0).map((x, i) => {
                return <Octave
                    key={i}
                    keysPressed={keysPressed}
                    onMouseDownOnKey={onMouseDownOnKey}
                    octaveIndex={startingPoint + i}
                />
            })}
        </div>
    );
}
