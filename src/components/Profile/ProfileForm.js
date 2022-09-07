import { useRef, useContext } from "react";
import classes from "./ProfileForm.module.css";

import AuthContext from "../../store/Auth-Context";

import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const navigate = useNavigate();

  const newPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    //optional: add validation here

    //send the password change request in user profile-form
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA3s3WTX1KjgDw9uSj8mlg6e0k9b2-orPQ",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "aplication/json",
          // Authorization: "Bearer x(token)",
        },
        //handle success and error cases
      }
    ).then((res) => {
      //assume always succeeds!
      navigate('/', {replace: true});
    });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
