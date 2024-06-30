import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import './SignUp.css';
import { TitleBar } from '../TitleBar/TitleBar.js';
import { POST } from '../utils/API.js';

export function SignUp() {
  let navigate = useNavigate();

  function signUp() {
    const firstname = document.getElementById("firstnamest").value;
    const secondname = document.getElementById("secondnamest").value;
    const email = document.getElementById("emailst").value;
    const password = document.getElementById("passwordst").value;
    const confirmpassword = document.getElementById("confirm-passwordst").value;

    if(password != confirmpassword) {
      alert("Passwords do not match");
      return;
    }
    const user = {
      "email": email,
      "password": password,
      "name": firstname + " " + secondname
    }

    POST("signup", user).then((response) => {
      console.log(response);
      toast("Account created successfully", { type: 'success' });
      navigate('/login');
    })
    .catch((error) => {
      console.log(error);
      toast("Account creation failed", { type: 'error' });
    });
  }
  return (
    <div>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <TitleBar/>
      <div className="background">
        <form className="sign-up-input-box">
          <div className="sign-up-title"> Create an Account </div>
          <div className="sign-up-input-section">
            <div className="input-field-box">
              <i className="material-icons" style={{ fontSize: 32 }}> person </i>
              <input type="text" class="input-field" style={{width: 140}} placeholder="First Name" id="firstnamest" required />
              <input type="text" class="input-field" style={{width: 140}} placeholder="Second Name" id="secondnamest" required />
            </div>
            <div className="input-field-box">
              <i className="material-icons" style={{ fontSize: 32 }}> email </i>
              <input type="email" class="input-field" placeholder="Email" id="emailst" required />
            </div>
            <div className="input-field-box">
              <i className="material-icons" style={{ fontSize: 32 }}> lock </i>
              <input type="password" class="input-field" placeholder="Password" id="passwordst" minlength="8" required />
            </div>
            <div className="input-field-box">
              <i className="material-icons" style={{ fontSize: 32 }}> lock </i>
              <input type="password" class="input-field" placeholder="Confirm Password" id="confirm-passwordst" minlength="8" required />
            </div>
          </div>

          <div class="sign-up-button">
            <input type="button" class="block-button-big" value="SIGN UP" onClick={signUp}/>
          </div>
        </form>
        
      </div>
    </div>
  );
}

