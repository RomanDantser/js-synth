import { useEffect, useState } from "react";

import './Slider.css';

export default function Slider({
    setValue = () => {},
    defaultValue = 0,
    minValue = 0,
    maxValue = 100,
    units = '%'
}) {
    const [rangePoints, setRangePoints] = useState(defaultValue);
    const [inSlider, setInSlider] = useState(false);
    const [currentSlider, setCurrentSlider] = useState(null);

    useEffect(()=> {
        document.onmousemove = sliderHandler;
        document.addEventListener('mouseup', onMouseUp);
    }, [inSlider]);


    function sliderHandler (event) {
        if(inSlider) {
            const elementRect = currentSlider.getBoundingClientRect();
            let diff = event.clientX - elementRect.x;
            if(diff < 0) {
                diff = 0;
            } else if(diff > currentSlider.offsetWidth) {
                diff = currentSlider.offsetWidth;
            }
            const widthOnOneRangePoint = currentSlider.offsetWidth / 97;
            const currentRangePoints = diff / widthOnOneRangePoint;
            const coefficient = 97 / (maxValue - minValue);
            setRangePoints(currentRangePoints);
            setValue(currentRangePoints / coefficient);
        }
    }

    function onMouseDown (event) {
        if(!currentSlider) {
            setCurrentSlider(event.target)
        }
        setInSlider(true);
        const elementRect = event.target.getBoundingClientRect();
        const diff = event.clientX - elementRect.x;
        if(diff < 0 || diff > event.target.offsetWidth) {
            return null;
        }
        const widthOnOneRangePoint = event.target.offsetWidth / 100;
        const currentRangePoints = (event.clientX - elementRect.x) / widthOnOneRangePoint;
        const coefficient = 100 / (maxValue - minValue);
        setRangePoints(currentRangePoints);
        setValue(currentRangePoints / coefficient);
    }
    
    function onMouseUp () {
        setInSlider(false);
    }

    return (
        <div className="slider" onMouseDown={onMouseDown}>
            <div className="slider-head" style={{left: rangePoints + '%'}}></div>
            <div className="slider-grid">
                {new Array(30).fill(null).map((v, i) => {
                    if(i == 0) {
                        return <div key={i} className="slider-grid-element-top">{minValue == 0 ? minValue :`${minValue}${units}`}</div>
                    } else if(i == 9) {
                        return <div key={i} style={{textAlign:"right"}} className="slider-grid-element-top">{`${maxValue}${units}`}</div>
                    } else if(i < 10) {
                        return <div key={i} className="slider-grid-element-top" />
                    } else {
                        return <div key={i} className="slider-grid-element" />
                    }
                })}
            </div>
        </div>
    );
}