import { useState, useRef, useContext } from "react";
import AuthContext from "../../store/Auth-Context";

// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  // const history = useHistory();
  const navigate = useNavigate();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  console.log(emailInputRef);

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    const enteredPassword = passwordInputRef.current.value;

    //optional: Add validation

    //check if logged in and then give permission

    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA3s3WTX1KjgDw9uSj8mlg6e0k9b2-orPQ";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA3s3WTX1KjgDw9uSj8mlg6e0k9b2-orPQ";
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);

        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data);
            //show error modal
            let errorMessage = "Authentication Failed";
            // if (data && data.error && data.error.message){
            //   errorMessage = data.error.message;
            // }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // console.log(data);

        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        ); //+ = converts to number, *1000 from s to ms

        authCtx.login(data.idToken, expirationTime.toISOString());
        
        //history.replace();

        //replace = cant use back button to go back
        // navigate(‘/path’, {replace: true});
        // Navigate(-1); // to go back to the previous page.
        // Navigate(-2); // go to the page before the previous page.
        // Navigate(1); // go to forward page.
        navigate("/", { replace: true });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Loading...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
