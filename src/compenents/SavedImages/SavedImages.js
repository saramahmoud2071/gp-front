import { useEffect , useState } from 'react';
import {GET} from '../utils/API.js';
import './SavedImages.css';

export function SavedImages() {
    const [generated_images, setGeneratedImages] = useState([]);
    const [seg_masks, setSegMasks] = useState([]);
   const [gn , setGn] = useState(true);


  useEffect(() => {
    GET('image').then((res) => {
      setGeneratedImages(res.images.filter((image) => image.type === 'regular'));
      setSegMasks(res.images.filter((image) => image.type === 'mask'));
    });

  }, []);

  const [maximizedImage, setMaximizedImage] = useState(null);

  function showImage(e) {
    setMaximizedImage(
      <div className="bgmodal">
        <link href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css" rel="stylesheet"/>
        <div className="modal-content">
            <button className="close">
                <i className="material-icons" onClick={closeImage}>
                    close
                </i>
            </button>
            <div>
              <img className="maximized-image" src={e.target.src} alt="..." />
              <div className="btns">
                <button className="btn download"> 
                  <i className="bx bx-download" style={{ fontSize: '22px' }}></i>
                  Download 
                </button>
              </div>
            </div>
        </div>
      </div>
    );
  }

  function closeImage() {
    setMaximizedImage(null);
  }

  return (
    <div className="saved-images">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <div className='gall-head' >
          <h1 style={{borderTopLeftRadius:"12px" , borderBottomLeftRadius:"12px"}} className={gn?"sel":""}  onClick={()=>{setGn(true)}} >Images</h1>
          <h1 style={{borderTopRightRadius:"12px" , borderBottomRightRadius:"12px"}} className={!gn?"sel":""}  onClick={()=>{setGn(false)}}>Masks</h1>
          
        </div>
         <div style={{padding:"150px 10%" , textAlign:"center"}}>
            {
              gn&& generated_images.map((image,index) =>     
                <img style={{border:"1px solid #000",width:"400px" , height:"400px", margin:"4px"}} className="image" key={index} id={index} src={image.url} alt="..." onClick={showImage} />)

            }
            {
              !gn&& seg_masks.map((image,index) =>     
                <img className="image" style={{border:"1px solid #000", width:"400px" , height:"400px", margin:"4px"}} key={index} id={index} src={image.url} alt="..." onClick={showImage} />)

            }
         </div>
      { maximizedImage }
    </div>
  );
}