import React, { useState ,useEffect } from 'react';
import {toast} from 'react-toastify';

function ImageSelector({ images , addImage , selectedImages , setSelectedImages }) {

  const handleImageSelect = (image) => {
    if(selectedImages.includes(image)){
      setSelectedImages(selectedImages.filter((selectedImage) => selectedImage !== image));
      return
    }
    setSelectedImages([...selectedImages, image]);
  };

  const handleFileInputChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    console.log(selectedFile.name);

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Send the file upload request to the Sails.js server using the fetch API
    const response = await fetch(/*process.env.REACT_APP_API_BASE_URL*/ "http://localhost:1337/" + 'image/upload', {
      method: 'POST',
      body: formData,
      headers: new Headers({
        'Authorization': `Bearer ${localStorage.getItem('_ria')}`,
      })
    });

    // Handle the response from the Sails.js server
    if(response.ok) {
      const data = await response.json();
      addImage(data.url)
      toast(`File uploaded successfully`);
    } 
    else {
      toast(`Error uploading file: ${response.statusText}`,{type:'error'});
    }
  };

  return (
    <div className='img-view'>
      {images.map((image,i) => (
        <Image
          key={i}
          image={image}
          isSelected={ image in selectedImages}
          onImageSelect={handleImageSelect}
        />
      ))}
      <label class="styled-file-input" for="image">
        <div className='plus'> + </div>
        <input type="file" id="image" name="image" accept="image/*" onChange={handleFileInputChange}/>
      </label>
    </div>
  );
}

function Image({ image, isSelected, onImageSelect }) {
  const handleCheckboxChange = () => {
    onImageSelect(image);
  };

  return (
    <div style={{position:"relative"}}>
      <img style={{width:'200px' , height:"200px"}} src={image} alt={''} />
      <input className='img-ck' type="checkbox" onChange={handleCheckboxChange} />
    </div>
  );
}

export default ImageSelector;
