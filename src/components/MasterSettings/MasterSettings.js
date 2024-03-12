import { useEffect } from "react";
import synth from "../../synth/index.js";

import './MasterSettings.css';
import Slider from "../Slider/Slider.js";

export default function MainOutputSettings() {

    const setVolume = (volume) => {
        synth.setMasterVolume(volume);
    };

    useEffect(() => {
            setInterval(() => {
                const analyserData = synth.getDataFromAnalyser();
                const canvas = document.getElementById('main-output');
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = "#FFFBEB";
                const WIDTH = canvas.width, HEIGHT = canvas.height;
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                
                ctx.lineWidth = 0.25;
                ctx.strokeStyle = '#495579';
                const gridXLines = 5, gridYLines = 5;
                
                let lineSlice = WIDTH / gridXLines;
                let coordX = 0, coordY = 0;

                for(let i = 0; i < gridXLines + 1; i++) {
                    ctx.beginPath();
                    ctx.moveTo(coordX, coordY);
                    ctx.lineTo(coordX, coordY + HEIGHT);
                    ctx.stroke();
                    coordX += lineSlice;
                }

                lineSlice = HEIGHT  / gridYLines;
                coordX = 0;
                coordY = 0;
                for(let i = 0; i < gridYLines + 1; i++) {
                    ctx.beginPath();
                    ctx.moveTo(coordX, coordY);
                    ctx.lineTo(coordX + WIDTH, coordY);
                    ctx.stroke();
                    coordY += lineSlice;
                }

                if(!analyserData) { 
                    return;
                }
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#251749";
                ctx.beginPath();
    
                const sliceWidth = WIDTH / analyserData.length;
                let x = 0;
                
                for(let i = 0; i < analyserData.length; i++) {
                    const v = analyserData[i] / 128.0;
                    const y = v * (HEIGHT / 2);
                  
                    if (i === 0) {
                      ctx.moveTo(x, y);
                    } else {
                      ctx.lineTo(x, y);
                    }
                  
                    x += sliceWidth;
                }
                ctx.lineTo(WIDTH, HEIGHT / 2);
                ctx.stroke();
            }, 100);
    }, [])

    return (
        <>
            <div className="dashboard-item-title">Master Output</div>
            <canvas id="main-output" />
            <div className="dashboard-item-subtitle">Master Volume</div>
            <Slider setValue={setVolume} defaultValue={synth.volumeLevel * 100}/>
        </>
    )
}