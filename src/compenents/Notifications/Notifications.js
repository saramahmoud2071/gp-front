import { useState , useEffect } from 'react';
import { useNavigate , useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

import './Notifications.css';
import { Post } from '../Post/Post.js';
import avatar from '../../assets/avatar.png';
import { GET } from '../utils/API';

export function Notifications({ showProfile }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [currnetNotifications, setCurrnetNotifications] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    if(location.pathname==="/notifications") {
      setShowPost(false);
      GET('notify').then((response) => {
        setCurrnetNotifications(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    }
      
  }, [location]);

  function starPost(post, index, staredSet) {
    if(staredSet.has(post.id)) 
      return <Post key={index} id={index} post={post} showProfile={showProfile} isStared={true}/>
    return <Post key={index} id={index} post={post} showProfile={showProfile} />
  }

  function goToPost(e) {
    let postId = e.target.id;
    console.log("show post ", postId);
    navigate('/notifications/' + postId);
    setShowPost(true);

    GET(`post/notify?postId=${postId}`).then((data) => {
      const staredSet = new Set(data.stared);
      setPost(starPost(data.post, data.post.postId, staredSet));
    })
    .catch((error) => {
      toast('Error Fetching Posts', {type: 'error'});
    })
  }

  function Notification({ id, image, description }) {
    return (
      <div className="notification">
        <img className="notify-image" id={id} src={image?image:avatar} alt="avatar" onClick={goToPost} />
        <label className="description"> {description} </label>
      </div>
    );
  }
  
  return (
    <div className="notifications">
      { currnetNotifications && !showPost &&
        currnetNotifications.map((notify, index) => 
          <Notification key={index} id={notify.postId} image={notify.image} description={notify.description} />      
        ) 
      }
      { showPost && post }
    </div>
  );
}


