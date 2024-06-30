import './Comment.css';
import avatar from '../../assets/avatar.png';

export function Comment({ comment }) {
  console.log("WWWWWWWWWWWWWWw",comment)

  return (
    <div className="comment">
      <div className="user-avatar">
        <img src={comment.userId &&comment.userId.avatar || avatar} alt="author avatar"></img>
      </div>

      <div className="user-data">
          <div className="username"> {comment.userId && comment.userId.name} </div>
          <div  style={{color:"rgba(0,0,0,0.6)", marginBottom:"10px", fontSize:"12px"}}>{new Date(comment.createdAt).toUTCString() }</div>
          <div className="comment-text"> {comment.text} </div>
      </div>
    </div>
  );
}