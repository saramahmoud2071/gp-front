import { useState } from 'react';
import { toast } from 'react-toastify';

import './Home.css';

import { PostWall } from '../PostWall/PostWall.js';
import { Post } from '../Post/Post.js';
import { POST } from '../utils/API';

export function Home({ showProfile }) {
  const filter_classes = ["description", "user"];
  const filter_options = filter_classes.map((filter_option) => 
      <option key={filter_option}>{ filter_option }</option>
  );

  const [filterType, setFilterType] = useState("description");
  const [searchFilter, setSearchFilter] = useState("");
  const [posts, setPosts] = useState([]);

  function filterSearch() {
    if(searchFilter !== "") {
      const query = {
        filterType: filterType,
        searchFilter: searchFilter
      };
      POST('post/filter', query).then((data) => {
        setPosts(data.posts.map((post, index) => 
            <Post key={index} id={index} post={post} showProfile={showProfile} />        
        ))
        console.log(data.posts);
      })
      .catch((error) => {
        console.log(error);
        toast('Error Fetching Posts', {type: 'error'});
      })
    }
    else {
      setPosts([]);
    }
  }

  return (
    <div className="home">
      <div className="search-bar" style={{width: '760px'}}>
        <input type="search" className="search-text" id="search-prompt" 
          onChange={(e) => {
            setSearchFilter(e.target.value);
          }}
        />
        <select className="filter-select" name="filter-class" id="filter-class"
          onChange={(e) => {
            setFilterType(e.target.value);
          }}
        >
          { filter_options }
        </select>
        <button className="search-btn block-button-small" style={{width: '90px', height: '36px'}} onClick={filterSearch}> Search </button>
        <button className='block-button-small' style={{width: '120px', height: '36px'}} 
            onClick={()=>{
                document.getElementById('myDialog').showModal();
            }}>
            New Post
        </button>
      </div>
      <PostWall posts={posts} showProfile={showProfile} />
    </div>
  );
}