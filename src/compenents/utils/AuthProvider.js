import { POST } from "./API";
import {toast} from 'react-toastify';
export const AuthUtil = {
    isAuthenticated: false,
    signin(user ,callback) {

        // POST("login",user).then((response) => {


        // }).catch((error) => {

        // });

        fetch(process.env.REACT_APP_API_BASE_URL + 'login', {
            method: 'POST',
            credentials: 'include',
            body: (user),
          })
            .then((res) => {
              if(res.status != 200)
                throw res;
                AuthUtil.isAuthenticated = true;
                res.json().then((res) => {
                    localStorage.setItem('_ria', res.token);
                    setTimeout(callback(),100);
                });
        
            }).catch((err) => {
              console.log(err);
              console.log(err);
              console.log(process.env.REACT_APP_API_BASE_URL,user);
              toast("Invalid password or Email", {
                  type: 'error'
                });
          });


  

    },
    signout(callback) {
        AuthUtil.isAuthenticated = false;
      setTimeout(callback, 100);
    },
  };