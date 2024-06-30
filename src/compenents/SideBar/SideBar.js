import { useEffect, useState } from 'react';
import { Link , useLocation , useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './SideBar.css';
import { GET } from '../utils/API';
import avatar from '../../assets/avatar.png';

export function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [sidebar, setSidebar] = useState(false);
    
    useEffect(() => {
        GET('user').then((res) => {
            setUser(res);
            sessionStorage.setItem('user', JSON.stringify(res));

        }).catch((err) => {
            toast(err.message, {type: 'error'});
        });

        setSidebar (Array.from(document.querySelectorAll('.sidebar'))[0]);
        const navItems = Array.from(document.querySelectorAll('nav .nav-item'));
        navItems.forEach(navItem => {
            if(location.pathname === navItem.id) {
                navItem.classList.add('active');
            }
            
            navItem.addEventListener('click', () => {
                navItems.forEach(navItem => {
                    navItem.classList.remove('active');
                });
                navItem.classList.add('active');
            });
        });

    }, [location]);

    function useToggle() {
        if(sidebar.className === 'sidebar')
            sidebar.classList.add('open');
            
        else
            sidebar.classList.remove('open');
    }

    function signOut() {
        GET("logout").then((response) => {
          console.log(response);
          if(response.success) {
            localStorage.removeItem('_ria');
            sessionStorage.removeItem('user');
            navigate('/login');
          }
          else {
            toast("Can not logout", { type: 'error' });
          }
        })
        .catch((error) => {
          console.log(error);
          toast("Can not logout", { type: 'error' });
        });
    }

    return (
        <div>
            <div className="body">
                <link href="https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css" rel="stylesheet"/>
                <div className="sidebar">
                    <div className="toggle" onClick={useToggle}>
                        <i className="bx bx-chevron-right"></i>
                    </div>

                    <div className="logo">
                        <img style={{height : '60px', width:'60px',borderRadius : '50% 50% 50% 50%'}} src={user.avatar?user.avatar:avatar} alt="avatar"/>
                        <h3 style={{color : 'white', fontSize : '26px'}}>{user.name?user.name:""}</h3>
                    </div>

                    <br/> 

                    <nav>
                        <ul>
                            <li>
                                <Link to="/profile" className="nav-item" id="/profile">
                                    <i className="bx bxs-face"></i>
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/home" className="nav-item" id="/home">
                                    <i className="bx bxs-home"></i>
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/generate" className="nav-item" id="/generate">
                                    <i className="bx bxs-image-add"></i>
                                    <span>Generate Image</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/morphing" className="nav-item" id="/morphing">
                                    <i className="bx bxs-image"></i>
                                    <span>Image Morphing</span>
                                </Link>
                            </li>
                            <li>

                                <Link to="/images" className="nav-item" id="/images">
                                    <i className="bx bxs-photo-album"></i>
                                    <span>Saved Images</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/draw" className="nav-item" id="/draw">
                                    <i className="bx bxs-pencil"></i>
                                    <span>Generate Mask</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/notifications" className="nav-item" id="/notifications">
                                    <i className="bx bxs-bell"></i>
                                    <span>Notifications</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/bug" className="nav-item" id="/bug">
                                    <i className="bx bxs-message-dots"></i>
                                    <span>Report Bug</span>
                                </Link>
                            </li>
                            <li style={{marginTop: '30px'}} onClick={signOut}>
                                <Link to="/login" className="nav-item">
                                    <i className="bx bx-log-out"></i>
                                    <span>Log out</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}

