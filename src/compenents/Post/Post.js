import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import ImageViewer from 'react-simple-image-viewer';

import './Post.css';
import { Comment } from '../Comment/Comment.js';
import { POST , GET } from '../utils/API';
import ImageSelector from '../PostWall/ImageSelector';
import Loader from '../Loader/Loader';
import avatar from '../../assets/avatar.png';

export function Post({ post, isStared, showProfile }) {
    const [showComments, setShowComments] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [stared , setStared] = useState(isStared);

    const [comment, setComment] = useState([]);
    const [images, setImages] = useState(post.images);
    const [selectedImages, setSelectedImages] = useState(post.images);
    const [loading, setLoading] = useState(false);

    const maxImagesCount = 4;
  
    const openImageViewer = useCallback((index) => {
      setCurrentImage(index);
      setIsViewerOpen(true);
    }, []);
  
    const closeImageViewer = () => {
      setCurrentImage(0);
      setIsViewerOpen(false);
    };

    function rate() {
        post.stars = (post.stars || 0);

        POST('post/star', { postId: post.id, star: !stared, stars: post.stars, userId: sessionStorage.getItem("user").id })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        post.stars = (stared ? post.stars - 1 : post.stars + 1);
        setStared(!stared);
    }

    function addComment(e) {
        e.preventDefault();
        let text = e.target[0].value;
        
        POST('post/comment', { postId: post.id, comment: text }).then((res) => {
            post.comments = post.comments || []

            setComment([...comment, { text, userId: JSON.parse(sessionStorage.getItem('user')) }])
             
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    function handleComments () {
        if(showComments) {
            setShowComments(false)
        }
        else{
            setLoading(true)
            GET(`post/comment?postId=${post.id}`).then((res) => {
                console.log(res)
                setComment(res.comments)
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                
            })
            setShowComments(true)
        }
    }

    function showImages(img, index, length){
        if(index < maxImagesCount - 1 || (index === (maxImagesCount - 1) && length === maxImagesCount)){
            return <img
                    src={ img }
                    onClick={ () => openImageViewer(index) }
                    width={"100%"}
                    key={ index }
                    style={{ margin: '2px' }}
                    alt=""/>
        }
        else if(index === (maxImagesCount - 1)) {
            let remaining = length - maxImagesCount;
            return <div style={{position: 'relative', 'text-align': 'center'}}>
                <h3 style={{position:'absolute', zIndex : '1', color : 'white', 'font-size' : '380%', 'font-weight': 'normal', 
                top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)' }}>+{remaining}</h3>
                    <img
                        src={ img }
                        onClick={ () => openImageViewer(index) }
                        width={"100%"}
                        key={ index }
                        style={{ margin: '2px', background: 'rgba(0,0,0,0.46)', filter : 'brightness(60%)' }}
                        alt=""/>
            </div>
        }
        return null
    }

    function deletePost(e) {
        let postId = e.target.id;
        POST(`post/delete`, { postId: postId }).then((data) => {
            toast("Delete Post Successfully", { type: 'success' });
        })
        .catch((error) => {
            toast("Error Deleting Post", {type: 'error'});
        })
    }

    function addImage(url){
        setImages([url,...images]);
    }

    function editPost() {
        document.getElementById(post.id).showModal();
    }

    function submitEditPost() {
        let data = {
            id: post.id,
            description: document.getElementById('description' + post.id).value,
            images: selectedImages
        }
        POST('post/edit', data).then((data) => {
            toast('Post Edited Successfully', {type: 'success'});
        })
        .catch((err) => {
            toast('Error Editing Post', {type: 'error'});
        })  
        document.getElementById(post.id).close();
    }

    return (
        <div className="post">
            <link href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css" rel="stylesheet"/>

            <dialog className="post-edit" id={post.id}>
                <div className="close-bar">
                    <button className="closeBtn" onClick ={()=>{
                        document.getElementById(post.id).close();
                    }}>x</button>
                </div>
                <h1> Edit Post </h1>
                <textarea className="description" id={'description' + post.id} placeholder={post.description} rows="4" cols="50"></textarea>
                <ImageSelector images={images} addImage={addImage} selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
                <button className="submitBtn" onClick ={submitEditPost}> Submit </button>
            </dialog>

            <div className="user-info">
                <div className="user-avatar">
                    <img src={post.userId.avatar?post.userId.avatar:avatar} alt="author"></img>
                </div>

                <div className="user-data">
                    <div className="username" id={post.userId?.id} onClick={showProfile}> {post.userId?.name} </div>
                    <div className="post-date"> {new Date(post.createdAt).toUTCString()} </div>
                </div>

                {(post.userId?.id===JSON.parse(sessionStorage.getItem('user')).id) &&
                    <div className="dots">
                        <div className="dots-icon">
                            <i className="bx bx-dots-vertical" style={{fontSize:'24px', paddingTop:'5px'}} ></i>
                        </div>
                        <div class="dots-content">
                            <a id={post.id} onClick={deletePost}> Delete </a>
                            <a id={post.id} onClick={editPost}> Edit </a>
                        </div>
                    </div>
                }
            </div>

            <div className="post-text" style={{padding:"10px 20px"}}>
                {post.description}
            </div>

            <div className="">
            <div>
                <div className='postimg' style={post.images && post.images.length==1?{ gridTemplateColumns:"1fr"}:{}}>
                    { post.images && post.images.map((img, index) => (showImages(img, index, post.images.length))) }
                </div>


                        <div className='postimg' style={post.images && post.images.length==1?{ gridTemplateColumns:"1fr"}:{}}>
                        {post.images && post.images.map((img, index) => ( showImages(img, index, post.images.length) ))}
                        </div>



                        {isViewerOpen &&<div style={{zIndex:1000000000}}> 
                            <ImageViewer
                            src={ post.images }
                            currentIndex={ currentImage }
                            disableScroll={ false }
                            closeOnClickOutside={ true }
                            onClose={ closeImageViewer }
                            />
                            </div>
                        }
                        </div>
            </div>

            <div className="post-info">
                <div className="click-icon" onClick={rate} style={{display:"flex" ,alignItems:"center"}} >
                    <div className="icon"><i className={!stared ?"bx bx-star":"bx bxs-star"} style={{fontSize:"26px"}} ></i></div>
                    <div className="count">{post.stars || 0}</div>
                </div>
                <div className="click-icon" style={{display:"flex" ,alignItems:"center"}}  onClick={handleComments}>
                    <div className="icon"><i style={{fontSize:"26px", paddingTop:'5px'}} className="bx bx-comment"></i></div>
                    <div className="count">{post.comments ? post.comments.length :0}</div>
                </div>
            </div>

            
            {showComments && <div className='fade-in'>
                <div className='hline'></div>

                {loading && <Loader/>}
                {
                    comment && comment.map((c) =>  <Comment comment={c} />)
                }
            
                <div className="comment-input">
                    <div className="user-avatar" style={{margin:"15px"}}>
                        <img src={JSON.parse(sessionStorage.getItem("user"))&& JSON.parse(sessionStorage.getItem("user")).avatar || avatar} alt="avatar"></img>
                    </div>
                    <form onSubmit={addComment}>
                        <input name="text" type="text" maxLength="200" placeholder="Write you comment here"></input>
                        <button className="submit-button" type="submit">+
                        </button>
                    </form>
                </div>
            </ div>}
        </div>
    );
};
