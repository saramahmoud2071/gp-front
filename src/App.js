import './App.css';
import React, { useState ,useEffect } from 'react';

import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

import { SignIn } from './compenents/SignIn/SignIn.js';
import { SignUp } from './compenents/SignUp/SignUp.js';
import { SideBar } from './compenents/SideBar/SideBar.js';
import { AuthUtil } from "./compenents/utils/AuthProvider";

import { Home } from './compenents/Home/Home.js';
import { Profile } from './compenents/Profile/Profile.js';
import { ImageMorphing } from './compenents/ImageMorphing/ImageMorphing.js';
import { GenerateImage } from './compenents/GenerateImage/GenerateImage.js';
import { SavedImages } from './compenents/SavedImages/SavedImages.js';
import { DrawPlane } from './compenents/DrawPlane/DrawPlane.js';
import { Notifications } from './compenents/Notifications/Notifications.js';
import { BugReport } from './compenents/BugReport/BugReport.js';

function App() {
  const navigate = useNavigate();
  const [profileUserId, setProfileUserId] = useState(null);

  function showProfile(e) {
    setProfileUserId(e.target.id);
    console.log("show profile with userId", profileUserId);
    navigate("/home/" + e.target.id);
  }

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <SideBar/>
                <Home showProfile={showProfile} />
              </RequireAuth>
            }
          />
          <Route
            path="/home/*"
            element={
              <RequireAuth>
                <SideBar/>
                <Profile profileId={profileUserId} />
              </RequireAuth>
            }
          />
          <Route path="/profile" element={<RequireAuth><SideBar/><Profile/></RequireAuth>} > </Route>
          <Route path="/morphing" element={ <RequireAuth><SideBar/><ImageMorphing/></RequireAuth> } > </Route>
          <Route path="/generate" element={<RequireAuth><SideBar/><GenerateImage/></RequireAuth>}></Route>
          <Route path="/images" element={<RequireAuth><SideBar/><SavedImages/></RequireAuth>}></Route>
          <Route path="/draw" element={<RequireAuth><SideBar/><DrawPlane/></RequireAuth>}></Route>
          <Route 
            path="/notifications/*" 
            element={<RequireAuth>
              <SideBar/>
              <Notifications showProfile={showProfile} />
              </RequireAuth>
            } 
          />
          <Route path="/bug" element={<RequireAuth><SideBar/><BugReport/></RequireAuth>}></Route>
        </Routes>
      </AuthProvider>

    </div>
  );
}

let AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  let [user, setUser] = React.useState(null);

  let signin = (newUser,callback) => {
    return AuthUtil.signin(newUser,() => {
      setUser(newUser);
     callback();
    });
  };

  let signout = (callback) => {
    return AuthUtil.signout(() => {
      setUser(null);
     callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  // const myCookie = Cookies.get('_ria');
 const st  = localStorage.getItem('_ria');

  if(!st) {
    console.log("not logged in");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (!auth.user) {
  //   // Redirect them to the /login page, but save the current location they were
  //   // trying to go to when they were redirected. This allows us to send them
  //   // along to that page after they login, which is a nicer user experience
  //   // than dropping them off on the home page.
   
  // }

  return children;
}

function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);

    auth.signin(formData, () => {
      // Send them back to the page they tried to visit when they were
      // redirected to the login page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(from, { replace: true });
    });
  }

  return (
      <SignIn  handleSubmit={handleSubmit}/>
  );
}


export default App;
