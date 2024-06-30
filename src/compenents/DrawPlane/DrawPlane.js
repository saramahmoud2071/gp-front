import { useEffect, useRef, useState } from "react";

import './DrawPlane.css';
import { DrawToolBar } from "../DrawToolBar/DrawToolBar.js";

export function DrawPlane() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [brushColor, setBrushColor] = useState("black");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = brushColor;
    ctxRef.current = ctx;
  }, [lineWidth, brushColor]);

  function startDrawing(e) {
    ctxRef.current.beginPath();
    if(!isEraser) {
      ctxRef.current.moveTo(
        e.nativeEvent.offsetX, 
        e.nativeEvent.offsetY
      );
    }
    setIsDrawing(true);
  }

  function endDrawing() {
    ctxRef.current.closePath();
    if(!isEraser) {
      ctxRef.current.fill();
    }
    setIsDrawing(false);
  }

  function draw(e) {
    if(!isDrawing) {
      return;
    }
    if(!isEraser) 
      ctxRef.current.globalCompositeOperation = "source-over";
    else 
      ctxRef.current.globalCompositeOperation = "destination-out";
    
    ctxRef.current.lineTo(
      e.nativeEvent.offsetX, 
      e.nativeEvent.offsetY
    );
    ctxRef.current.stroke();
  }

  return (
    <div className="draw-plane" style={{padding:"40px 10%"}}>
        <div style={{width:"100%", display:"flex", flexDirection:"column", alignItems:"center"}}>
        <DrawToolBar
          setLineWidth={setLineWidth}
          setBrushColor={setBrushColor}
          brushColor={brushColor}
          setIsEraser={setIsEraser}
          isEraser={isEraser}
          canvasElement={canvasRef}
        />
        <canvas className="canvas-plane"
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          ref={canvasRef}
          width={`512px`}
          height={`512px`}
        />
        </div>
    </div>
  );
}

