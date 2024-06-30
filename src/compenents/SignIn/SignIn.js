import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import './SignIn.css';
import { TitleBar } from '../TitleBar/TitleBar.js';
import { POST } from "../utils/API";

export function SignIn() {
  const navigate = useNavigate();

  function signIn() {
    var email = document.getElementById("emailst").value;
    var password = document.getElementById("passwordst").value;
    var user = {
      "email": email,
      "password": password
    }

    POST("login",user).then((response) => {
      console.log(response);
      localStorage.setItem('_ria', response.token);
      navigate('/home');
    })
    .catch((error) => {
      console.log(error);
      toast("Invalid password or Email", { type: 'error' });
    });
  }


  return (
    <div>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <TitleBar/>
      <div className="background">
        <div>
          <form className="sign-in-input-box">
            <div className="sign-in-title"> Enter Your Account </div>
              <div className="sign-in-input-section">

                <div className="input-field-box">
                  <i className="material-icons" style={{ fontSize: 32 }}> email </i>
                  <input type="email" class="input-field" placeholder="Email" id="emailst" required />
                </div>

                <div className="input-field-box">
                  <i class="material-icons" style={{ fontSize: 32 }}> lock </i>
                  <input type="password" class="input-field" placeholder="Password" id="passwordst" minlength="8" required />
                </div>

              </div>

              <div class="sign-in-button">
                <input type="button" class="block-button-big" value="SIGN IN" onClick={signIn}/>
              </div>
          </form>

            <div className="sign-up">
                <div> Don't have an account? </div>
                <button className="block-button-small left-margin" onClick={() => navigate("/signUp")}>
                    SIGN UP
                </button>
            </div>   
        </div>
      </div>
    </div>
  );
}

