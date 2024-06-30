import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

import './Profile.css';
import myAvatar from '../../assets/avatar.png';
import myCover from '../../assets/pro.jpg';

import { GET , POST } from '../utils/API';
import { PostWall } from "../PostWall/PostWall";

export function Profile({ profileId }) {
    const [id, setId] = useState(null);
    const [name, setName] = useState(null); const [newName, setNewName] = useState(null);
    const [email, setEmail] = useState(null); const [newEmail, setNewEmail] = useState(null);
    const [job, setJob] = useState(null); const [newJob, setNewJob] = useState(null);
    const [phone, setPhone] = useState(null); const [newPhone, setNewPhone] = useState(null);
    const [avatar, setAvatar] = useState(myAvatar);
    const [cover, setCover] = useState(myCover);

    const [numFollowers, setNumFollowers] = useState(0);
    const [isFollower, setIsFollower] = useState(false);

    const [small , setSmall] = useState(false);
    const [me, setMe] = useState(true);

    useEffect(() => {
        window.addEventListener("scroll", function () {
            // var banner = document.querySelector(".pro-head");
            // if(window.scrollY > 0)
            //     setSmall(!small);

            //     var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // if (scrollTop === 0) {
            //     setSmall(false)
            //     // The user has scrolled to the top of the page
            //     console.log("Scrolled to top of page");
            //     }

            // if (window.scrollY > 0) {
            //     setSmall(false)
            //     // banner.classList.add("pro-head-min");
            // }
            // banner.classList.toggle("pro-head-min", window.scrollY > 0);
        });

    },[]);

    useEffect(() => {
        if(!profileId) {
            GET('user').then((response) => {
                setId(response.id);
                setName(response.name); setNewName(response.name);
                setEmail(response.email); setNewEmail(response.email);
                setJob(response.job); setNewJob(response.job);
                setPhone(response.phone); setNewPhone(response.phone);
                setAvatar(response.avatar);
                setCover(response.cover);
                setNumFollowers(response.followers.length);
                sessionStorage.setItem('user', JSON.stringify(response));
            });
        }
        else {
            console.log("profileId", profileId);
            GET(`user?profileId=${profileId}`).then((response) => {
                setId(response.id);
                setName(response.name); setNewName(response.name);
                setEmail(response.email); setNewEmail(response.email);
                setJob(response.job); setNewJob(response.job);
                setPhone(response.phone); setNewPhone(response.phone);
                setAvatar(response.avatar);
                setCover(response.cover);
                setNumFollowers(response.followers.length); 
                setIsFollower(checkFollower(response.followers));
            })
            .catch((error) => {
                console.log(error)
            });
        }
        
    },[profileId, name, email, job, phone, isFollower]);
    
    const [isNameDisabled, setIsNameDisabled] = useState(true);
    const [isEmailDisabled, setIsEmailDisabled] = useState(true);
    const [isJobDisabled, setIsJobDisabled] = useState(true);
    const [isPhoneDisabled, setIsPhoneDisabled] = useState(true);

    async function editAvatar(e) {
        let selectedFile = e.target.files[0];
        const response = await editImage(selectedFile);
        
        if(response.ok) {
            const data = await response.json();
            setAvatar(data.url);
            const newUser = {
                editType: "avatar",
                avatar: data.url
            };
            editInfo(newUser);
            toast(`File uploaded successfully`);
        } 
        else {
          toast(`Error uploading file: ${response.statusText}`,{type:'error'});
        }
    }

    async function editCover(e) {
        let selectedFile = e.target.files[0];
        const response = await editImage(selectedFile);
        
        if(response.ok) {
            const data = await response.json();
            setCover(data.url);
            const newUser = {
                editType: "cover",
                cover: data.url
            };
            editInfo(newUser);
            toast(`File uploaded successfully`);
        } 
        else {
          toast(`Error uploading file: ${response.statusText}`,{type:'error'});
        }
    }

    async function editImage(selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch(/*process.env.REACT_APP_API_BASE_URL*/ "http://localhost:1337/" + 'image/upload', {
          method: 'POST',
          body: formData,
          headers: new Headers({
            'Authorization': `Bearer ${localStorage.getItem('_ria')}`,
          })
        });

        return response;
    }

    function editName() {
        if(!isNameDisabled && (name!==newName)) {
            const newUser = {
                editType: "name",
                name: newName
            };
            editInfo(newUser);
        }
        setIsNameDisabled(!isNameDisabled);
    }

    function editEmail() {
        if(!isEmailDisabled && (email!==newEmail)) {
            const newUser = {
                editType: "email",
                email: newEmail
            };
            editInfo(newUser);
        }
        setIsEmailDisabled(!isEmailDisabled);
    }

    function editJob() {
        if(!isJobDisabled && (job!==newJob)) {
            const newUser = {
                editType: "job",
                job: newJob
            };
            editInfo(newUser);
        }
        setIsJobDisabled(!isJobDisabled);
    }

    function editPhone() {
        if(!isPhoneDisabled && (phone!==newPhone)) {
            const newUser = {
                editType: "phone",
                phone: newPhone
            };
            editInfo(newUser);
        }
        setIsPhoneDisabled(!isPhoneDisabled);
    }

    function editInfo(newUser) {
        POST('edit', newUser).then((response) => {
            console.log(response);
            toast("Account updated successfully", { type: 'success' });
        })
        .catch((error) => {
            console.log(error);
            toast("Account update failed", { type: 'error' });
        });
    }

    function follow() {
        let follow = isFollower?'unfollow':'follow';
        setIsFollower(!isFollower);
        POST(follow, {followeeId: profileId}).then((response) => {
            console.log(response);
            if(response.success) {
                toast(follow + " successfully", { type: 'success' });
            }
            else {
                toast("Failed to " + follow, { type: 'error' });
            }
        })
        .catch((error) => {
            console.log(error);
            toast("Failed to " + follow, { type: 'error' });
        });
    }

    function checkFollower(followers) {
        let userId = JSON.parse(sessionStorage.getItem('user')).id;
        var isFollower = false;
        followers.forEach((follower) => {
            if(follower.followerId === userId) {
                isFollower = true;
                return;
            }
        });
        return isFollower;
    }

    return (
        <div>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <div className={small? "pro-head pro-head-min": "pro-head" } >
                <div className="pro-head-mainimg">
                    <img src={cover?cover:myCover} alt="cover" />
                    <div className="pro-banner"></div>
                </div>
                <div className="pro-head-img" style={{height:"280px"}}>
                    <div style={{height : '160px', width : '160px'}}>
                        <img className="pro-img" style={{height : '100%', width : '100%'}} src={avatar?avatar:myAvatar} alt="avatar" />
                        {!profileId &&
                            <div className="block-button-small" style={{position: 'relative', 'text-align': 'center', width: '160px'}}>
                                <h4 style = {{top: '0%', left: '0%', transform: 'translateX(0%) translateY(30%)'}}> Edit Profile</h4>
                                <input type="file" style={{opacity: "0%", transform: 'translateX(0%) translateY(-60%)', width: '160px'}} 
                                        className="block-button-small" id="pro-image" name="image" accept="image/*" onChange={editAvatar}/>
                            </div>
                        }
                    </div>
                    <input type="text" className="pro-name" style={{transform: 'translateX(0%) translateY(60%)'}} value={newName} disabled={isNameDisabled}
                        onChange={(e) => {
                            setNewName(e.target.value);
                        }}
                    />
                    {!profileId &&   
                        <div className="wrapper" style={{transform: 'translateX(0%) translateY(60%)'}}>
                            <button className="edit-icon" onClick={editName}>
                                <i className="bx bx-pencil"></i>
                            </button>

                            <div className="block-button-small" style={{position: 'relative', 'text-align': 'center', width: '160px'}}>
                                <h4 style = {{top: '50%', left: '50%', transform: 'translateX(0%) translateY(30%)'}}> Edit Cover</h4>
                                <input type="file" style = {{opacity: "0%", transform: 'translateX(0%) translateY(-60%)', width: '200px', height:'42px'}} 
                                    id="cover" name="image" accept="image/*" onChange={editCover}/>
                            </div>
                        </div> 
                    }  
                    {profileId &&
                        <div className="follow-wrapper">
                            <button className={isFollower?"follow-btn dark":"follow-btn light"} onClick={follow}>
                                {isFollower &&
                                    <i className="bx bx-check" style={{ fontSize: 18, paddingRight: 3 }}></i>
                                }
                                {!isFollower &&
                                    <i className="bx bx-plus" style={{ fontSize: 18, paddingRight: 3 }}></i>
                                }
                                Follow
                            </button>
                            <div className="num-followers">
                                { numFollowers + " follower" }
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div className={small? "pro-body":"pro-body" }>
                <div className="personal-card">
                    <label className="label"> Personal Info. </label>
                    <div className="info">
                        <div className="label-box">
                            <label className="info-label"> 
                                <i className="material-icons" style={{ fontSize: 22, marginRight: 8 }}> email </i>
                                Email 
                            </label>
                            {!profileId &&
                                <button className="edit-icon" onClick={editEmail}>
                                    <i className="bx bx-pencil"></i>
                                </button>
                            }
                        </div>
                        <input type="email" name="email" className="info-input" value={newEmail} disabled={isEmailDisabled}
                            onChange={(e) => {
                                setNewEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div className="info">
                        <div className="label-box">
                            <label className="info-label"> 
                                <i className="material-icons" style={{ fontSize: 22, marginRight: 8 }}> work </i>
                                Job Description 
                            </label>
                            {!profileId &&
                                <button className="edit-icon" onClick={editJob}>
                                    <i className="bx bx-pencil"></i>
                                </button>
                            }
                        </div>
                        <input type="text" name="job" className="info-input" value={newJob} disabled={isJobDisabled} 
                            onChange={(e) => {
                                setNewJob(e.target.value);
                            }}
                        />
                    </div>
                    <div className="info">
                        <div className="label-box">
                            <label className="info-label">
                                <i className="material-icons" style={{ fontSize: 22, marginRight: 8 }}> phone </i>
                                Phone
                            </label>
                            {!profileId &&
                                <button className="edit-icon" onClick={editPhone}>
                                    <i className="bx bx-pencil"></i>
                                </button>
                            }
                        </div>
                        <input type="text" name="phone" className="info-input" value={newPhone} disabled={isPhoneDisabled} 
                            onChange={(e) => {
                                setNewPhone(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <PostWall me={profileId?false:true} posts={[]} profileId={profileId} />
            </div>
        </div>
    );
}
