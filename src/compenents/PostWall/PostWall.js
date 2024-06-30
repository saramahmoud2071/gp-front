import { useState , useEffect} from 'react';
import { toast } from 'react-toastify';

import './PostWall.css';
import { Post } from '../Post/Post.js';
import { GET , POST } from '../utils/API';
import ImageSelector from './ImageSelector';

export function PostWall({ me , posts , profileId , showProfile }) {
    const [homePosts, setHomePosts] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [skip, setSkip] = useState(0);
    const [initialPostsFetched, setInitialPostsFetched] = useState(false);

    function addImage(url){
        setImages([url,...images]);
    }

    function starPost(post, index, staredSet) {
        if(staredSet.has(post.id)) 
            return <Post key={index} id={index} post={post} showProfile={showProfile} isStared={true}/>
        return <Post key={index} id={index} post={post} showProfile={showProfile} />
    }

    useEffect(() => {
        if(initialPostsFetched) {
            if(me) {
                GET(`post?skip=${skip}`).then((data) => {
                    const staredSet = new Set(data.stared);
                    setHomePosts(prevPosts => [...prevPosts, ...data.posts.map((post, index) => 
                        starPost(post, index, staredSet)
                    )]);
                    setSkip(prevSkip => prevSkip + data.posts.length);
                })
                .catch((error) => {
                    toast('Error Fetching Posts', {type: 'error'});
                })
                return  
            }
        
            if(profileId) {
                GET(`post?skip=${skip}&profileId=${profileId}`).then((data) => {
                    const staredSet = new Set(data.stared);
                    setHomePosts(prevPosts => [...prevPosts, ...data.posts.map((post, index) => 
                        starPost(post, index, staredSet)
                    )]);
                    setSkip(prevSkip => prevSkip + data.posts.length);
                })
                .catch((error) => {
                    toast('Error Fetching Posts', {type: 'error'});
                })
                return  
            }

            GET('image?type=regular').then((data) => {
                setImages(data.images.map((image) => image.url));
            })
        
            GET(`post/feed?skip=${skip}`).then((data) => {
                const staredSet = new Set(data.stared);
                setHomePosts(prevPosts => [...prevPosts, ...data.posts.map((post, index) => 
                    starPost(post, index, staredSet)
                )]);
                setSkip(prevSkip => prevSkip + data.posts.length);
            })
            .catch((error) => {
                toast('Error Fetching Posts', {type: 'error'});
            })
        }
        else
            setInitialPostsFetched(true);
      
    }, [me, profileId, skip, initialPostsFetched, posts]);

    return (
        <div className="post-wall">
            
            <dialog id="myDialog">
                <div className="close-bar">
                    <button id="closeBtn" onClick ={()=>{
                        document.getElementById('myDialog').close();
                    }}>x</button>
                </div>
                <h1>Create Post</h1>
                <textarea id="description" name="description" placeholder='Write a description...' rows="4" cols="50"></textarea>

                <ImageSelector  images={images} addImage={addImage} selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
                
                <button id="submitBtn" onClick ={()=>{
                    let data = {
                        description: document.getElementById('description').value,
                        images: selectedImages
                    }
                    POST('post', data).then((data) => {
                        console.log("post data test" , data);
                        toast('Post Created Successfully');
                    })
                    .catch((err) => {
                        toast('Error Creating Post', {type: 'error'});
                    })  
                    document.getElementById('myDialog').close();

                }} > Submit </button>
            </dialog>

            { posts.length!==0? posts:homePosts }
        </div>
    );
}
