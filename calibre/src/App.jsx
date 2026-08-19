import { useState, useRef, useEffect} from "react";
import "./App.css";



const sampleSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">
  <rect width="480" height="600" fill="#1b212a"/>

  <!-- shoulders -->
  <path d="M 60 600 Q 60 400 140 360 L 340 360 Q 420 400 420 600 Z" fill="#3a4453"/>

  <!-- head -->
  <ellipse cx="240" cy="215" rx="105" ry="130" fill="#3a4453"/>

  <!-- eyes -->
  <circle cx="178" cy="215" r="9" fill="#edeae2"/>
  <circle cx="178" cy="215" r="4" fill="#12161c"/>
  <circle cx="302" cy="215" r="9" fill="#edeae2"/>
  <circle cx="302" cy="215" r="4" fill="#12161c"/>

  <!-- nose hint -->
  <path d="M 236 225 L 228 265 Q 240 274 252 265 L 244 225" fill="none" stroke="#2a3340" stroke-width="2"/>

  <!-- card -->
  <rect x="154" y="430" width="171" height="108" rx="8" fill="#c9a15a"/>
  <rect x="154" y="430" width="171" height="108" rx="8" fill="none" stroke="#8a6e3c" stroke-width="2"/>
  <rect x="170" y="450" width="42" height="30" rx="4" fill="#8a6e3c"/>
  <rect x="170" y="495" width="115" height="8" rx="2" fill="#8a6e3c" opacity="0.6"/>
  <rect x="170" y="510" width="80" height="8" rx="2" fill="#8a6e3c" opacity="0.4"/>
</svg>
`;
const sampleSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSVG)}`;


function App() {
  const [photo, setphoto] = useState(null);
  const [points, setpoints] = useState([]);
  const [pupilpoints, setpplpoints] = useState([]);
  const inputRef = useRef(null);
  const contaninerRef = useRef(null);
  const [dragging, setDragging] = useState(null)


  useEffect(() => {
  if (!dragging) return;

  function handleMove(event) {
    const rect = contaninerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (dragging.type === "card") {
      const newPoints = [...points];
      newPoints[dragging.index] = { x, y };
      setpoints(newPoints);
    } else {
      const newpupilpoints = [...pupilpoints];
      newpupilpoints[dragging.index] = { x, y };
      setpplpoints(newpupilpoints);
    }
  }

  function handleUp() {
    setDragging(null);
  }

  window.addEventListener("pointermove", handleMove);
  window.addEventListener("pointerup", handleUp);

  return () => {
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleUp);
  };
}, [dragging]);
  



  



  function startDrag(type, index) {
    return function (event) {
      event.stopPropagation();
      setDragging({ type, index})
    }
  }


  function handelingphoto(event) {
  const file = event.target.files[0];
  const reader =  new FileReader();
  reader.onload = () => {
    setphoto(reader.result)
    };
    reader.readAsDataURL(file)
  }

  function handelingphotosample(event) {
  const filesample = event.target.files[0];
  const reader =  new FileReader();
  reader.onload = () => {
    setphoto(sampleSrc)
    };
    reader.readAsDataURL(sampleSrc)
  }


  function getInstruction() {
  if (!photo) return "Upload a photo or try the sample.";
  if (points.length < 2) return "Click both the horizontal edges of the card"; // your turn
  if (pupilpoints.length < 2) return "Click on both of your pupils"; // your turn
  return (null)
}


  function handleimageclick(event){

    const rect = contaninerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (points.length < 2){
      setpoints([...points, {x,y}]);
    }
    else if (pupilpoints.length < 2){
      setpplpoints([...pupilpoints, {x,y}]);
    }
    else {
      
    }

    console.log(x,y);
  }

  let distancecardist = null;
  let distanceppldist = null;
  let mmPerPX = null;
  let pdMm = null;

  if (points.length === 2){
  distancecardist = Math.sqrt((points[0].x - points[1].x)**2 + (points[0].y - points[1].y)**2)
  }
  if (pupilpoints.length === 2){
  distanceppldist = Math.sqrt((pupilpoints[0].x - pupilpoints[1].x)**2 + (pupilpoints[0].y - pupilpoints[1].y)**2)
  }
  

  if (distancecardist != null && distanceppldist != null){ 
  mmPerPX = 85.6/distancecardist
  pdMm = distanceppldist * mmPerPX}



  return (
    <div className="divb">
      <div className="divc">
      <button className="upload-btn" onClick={() => inputRef.current.click()}>Choose a file</button>
      <button className="upload-btn" onClick={() => setphoto(sampleSrc)}>Try a Sample</button>
      </div>
      <input ref={inputRef} type="file" style={{ display: "none" }} onChange={handelingphoto}/>
      <div ref={contaninerRef} onClick={handleimageclick} style={{position: "relative"}}>{photo && <img src={photo} alt="uploaded" style={{width: "100%", display: "block"}}/>}
        {points.map((point, index) => (
  <div
    key={index}
    className="marker markercard"
    onPointerDown={startDrag("card", index)}
    style={{ left: point.x, top: point.y }}
  />
))}
{pupilpoints.map((pplpoint, index2) => (
  <div
    key={index2}
    className="marker markerpupil"
    onPointerDown={startDrag("pupil", index2)}
    style={{ left: pplpoint.x, top: pplpoint.y }}
  />
))}


      </div>
     
     
     <p>Distance: {pdMm ? pdMm.toFixed(1) : "-"}mm</p>
     {!pdMm && <p>{getInstruction()}</p>}
    </div>
  );
}

export default App;