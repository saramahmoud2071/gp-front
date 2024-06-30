import './GenerateImage.css';

export function GenerateImage() {
  return (
    <div className="generate-image">
      <link href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css" rel="stylesheet"/>

      <div className="generate-div">
        <input type="text" className="text-prompt" placeholder="Text prompt" />
        <button className="action-btn generate block-button-small"> 
          <i className="bx bx-play" style={{ fontSize: '20px' }}></i>
          generate
        </button>
      </div>

      <div className="images-div">
        <div className="image-div">
          <h2> Segmentation mask Image </h2>
          <img className="image" 
            src="https://fastly.picsum.photos/id/596/1024/768.jpg?hmac=q9PXDEOrLj3oAS3xpSFnYzN__ZQa_RxqouJ0G-sHQ8A" 
            alt="Segmentation mask" />
          <div className="control mask-control">
            <button className="action-btn mask block-button-small" style={{width:'180px'}}> 
              <i className="bx bx-upload" style={{ fontSize: '22px' }}></i>
              upload mask
            </button>
            <button className="action-btn mask block-button-small" style={{width:'180px'}}> 
              <i className="bx bx-select-multiple" style={{ fontSize: '22px' }}></i>
              select mask
            </button>
          </div>
        </div>

        <div className="image-div">
          <h2> Generated Image </h2>
          <img className="image" 
            src="https://fastly.picsum.photos/id/596/1024/768.jpg?hmac=q9PXDEOrLj3oAS3xpSFnYzN__ZQa_RxqouJ0G-sHQ8A" 
            alt="Generated" />
          <div className="control generated-control">
            <button className="action-btn block-button-small"> 
              <i className="bx bx-save" style={{ fontSize: '20px' }}></i>
              save
            </button>
            <button className="action-btn download block-button-small" style={{width:'156px'}}> 
              <i className="bx bx-download" style={{ fontSize: '20px' }}></i>
              download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}