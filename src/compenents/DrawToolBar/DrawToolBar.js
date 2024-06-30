import { useEffect } from "react";
import {toast} from 'react-toastify';

import './DrawToolBar.css';

export function DrawToolBar({ setLineWidth, setBrushColor, brushColor, setIsEraser, isEraser, canvasElement}) {
    const classes_colors = new Map([
        ["Select Category", ""],
        ["person", "#FF0000"],
        ["bicycle", "#00FF00"],
        ["car", "#0000FF"],
        ["motorcycle", "#FFFF00"],
        ["airplane", "#FF00FF"],
        ["bus", "#00FFFF"],
        ["train", "#800000"],
        ["truck", "#808000"],
        ["boat", "#008000"],
        ["traffic light", "#FFA500"],
        ["fire hydrant", "#FFC0CB"],
        ["stop sign", "#800080"],
        ["parking meter", "#FFD700"],
        ["bench", "#C0C0C0"],
        ["bird", "#FF8C00"],
        ["cat", "#FF1493"],
        ["dog", "#00BFFF"],
        ["horse", "#008080"],
        ["sheep", "#DAA520"],
        ["cow", "#FF69B4"],
        ["elephant", "#4B0082"],
        ["bear", "#9400D3"],
        ["zebra", "#00FA9A"],
        ["giraffe", "#FF7F50"],
        ["backpack", "#2E8B57"],
        ["umbrella", "#FF4500"],
    ]);
    const seg_classes = Array.from(classes_colors.keys());
    const classes_options = seg_classes.map((class_option) => 
        <option key={class_option}>{ class_option }</option>
    );

    useEffect(() => {
        const toolBtns = Array.from(document.querySelectorAll('.btn-tool'));
        toolBtns.forEach(toolBtn => {
            toolBtn.addEventListener('click', () => {
                toolBtns.forEach(toolBtn => {
                    toolBtn.classList.remove('active');
                });
                toolBtn.classList.add('active');
                if(toolBtn.id === 'erase')
                    setIsEraser(true);
                else
                    setIsEraser(false);
            });
        });

    }, [brushColor, isEraser]);

    return (
        <div className="tool-bar">
            <link href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css" rel="stylesheet"/>
            <div className="draw-tool-bar">
                <button className="btn-tool active" id="draw">
                    <i className="bx bx-pencil" style={{ fontSize: '22px' }}></i>
                </button>
                <button className="btn-tool" id="erase">
                    <i className="bx bx-eraser" style={{ fontSize: '22px' }}></i>
                </button>

                <label> Stroke Width </label>
                <input
                    type="range"
                    min="3"
                    max="20"
                    onChange={(e) => {
                        setLineWidth(e.target.value);
                    }}
                />

                <select className="class-select" name="seg-class" id="seg-class"
                    onChange={(e) => {
                        const class_option = e.target.value;
                        const class_color = classes_colors.get(class_option);
                        setBrushColor(class_color);
                    }}
                >
                    { classes_options }
                </select>
                <div className="class-color" style = {{ backgroundColor: brushColor }}></div>
            </div>

            <div className="button-bar">
                <button className="btn save block-button-small" style={{width: '120px'}}

                    onClick={(e) => {
                       canvasElement.current.toBlob(async (blob) => {
                            // Create FormData object and add the Blob object to it
                            const formData = new FormData();
                            formData.append("file", blob, "canvas-image.png");
                            formData.append("type", 'mask');

                            const response = await fetch(/*process.env.REACT_APP_API_BASE_URL*/ "http://localhost:1337/"+ 'image/upload', {
                                method: 'POST',
                                body: formData,
                                headers: new Headers({
                                  'Authorization': `Bearer ${localStorage.getItem('_ria')}`,
                                })
                          
                              });

                              if (response.ok) {
                                const data = await response.json();
                                toast(`Mask Saved successfully`);
                              } else {
                                toast(`Error uploading file: ${response.statusText}`,{type:'error'});
                              }
                              

                        });
                        
                    }}>

                    <i className="bx bx-save" style={{ fontSize: '22px' }}></i>
                    Save 
                </button>
                <button className="btn download block-button-small" style={{width: '140px'}} 

                    onClick={(e) => {
                        var imageURI = canvasElement.current.toDataURL("image/png");
                        const downloadEl = document.createElement('a');
                        downloadEl.href = imageURI;
                        downloadEl.download = "generated-mask-image"; // name of downloaded file
                        downloadEl.click();
                        downloadEl.remove();
                    }}>
                    <i className="bx bx-download" style={{ fontSize: '22px' }}></i>
                    Download 
                </button>
            </div>
        </div>
    );

}

