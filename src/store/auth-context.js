import React, { useState } from "react";

//make it so the timer clears when user logs out manually

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

//helper function to culculate time to loggin out automatically when inactive
const calculateRemainingtime = (expirationTime) => {
  const currentTime = new Date().getTime(); //gives timestamp in ms from date

  const adjustedExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjustedExpirationTime - currentTime;

  return remainingDuration;
};

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; //converts from false to true vice versa

  //local storage: stores simple data that survives when page reloaded (persistance)

  //local storage = synchronous API
  //when app starts I want to look in my local storage and see if token is there, and then use that token: initialize state with the token
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  //logout when logged in and inactive
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token); //built into browser

    const remainingTime = calculateRemainingtime(expirationTime);

    setTimeout(logoutHandler, remainingTime);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
