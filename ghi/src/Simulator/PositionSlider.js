import React, {useState, useContext} from 'react';
import { SimulatorActionsContext } from '../Context/SimulatorActionsContext';
import Slider from '@mui/material/Slider';


function PositionSlider({
    handleChangePosition,
    handleChangeScale,
    handleChangeTransformRotateX,
    volume
}){

    const [show, setShow] = useState(true)

    const {mute} = useContext(SimulatorActionsContext)

    const handleWheel = (event) => {
        event.preventDefault();
        const scrollDelta = event.deltaY;
        if (scrollDelta > 0) {
            handleChangeScale('decrease');
        } else if (scrollDelta < 0) {
            handleChangeScale('increase');
        }
    };

    return (
        <div className={show? "settings_container" : "settings_container_hide"}
            onWheel={handleWheel}
        >
            <p className='lock pointer' onClick={() => setShow(!show)}>
                {show? "Hide" : "Show"}
            </p>
            <div className={show? "inner_container": "inner_container_hide"}>

                <div className="translate_button_container">
                    <div className='vertical_container'>
                        <div className='translate_button' onClick={() => handleChangePosition('up')}>
                            <p className="utf-symbol">&#9650;</p>
                        </div>
                    </div>
                    <div className='horizontal_container'>
                        <div className='translate_button' onClick={() => handleChangePosition('left')}>
                            <p className="utf-symbol">&#9664;</p>
                        </div>
                        {/* adjusting the poisition back to the original */}
                        <div className='translate_button' onClick={() => handleChangePosition('return')}>
                            <p className="utf-symbol">&#9679;</p>
                        </div>
                        <div className='translate_button' onClick={() => handleChangePosition('right')}>
                            <p className="utf-symbol">&#9654;</p>
                        </div>
                    </div>
                    <div className='vertical_container'>
                        <div className='translate_button' onClick={() => handleChangePosition('down')}>
                            <p className="utf-symbol">&#9660;</p>
                        </div>
                    </div>
                </div>
                <div className="size_button" onClick={() => handleChangeScale('increase')}>
                    <p className="utf-symbol2">&#43;</p>
                </div>
                <div className="size_button" onClick={() => handleChangeScale('decrease')}>
                    <p className="utf-symbol2">&#8722;</p>
                </div>
                <div className="slider_container">
                    <Slider
                        orientation="vertical"
                        defaultValue={45}
                        aria-labelledby="vertical-slider"
                        onChange={handleChangeTransformRotateX}
                        max={80}
                    />
                </div>
                <img
                    className="volume"
                    src={ volume > 0? "https://i.imgur.com/O2EDSc6.png":'https://i.imgur.com/UJoc11y.png'}
                    onClick={() => mute()}
                />
            </div>
        </div>
    )
}

export default PositionSlider;
