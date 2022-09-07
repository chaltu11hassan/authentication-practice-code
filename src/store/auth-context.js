import React, { useState, useEffect, useCallback } from "react";

//make it so the timer clears when user logs out manually
let logoutTimer; //global variable

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

//helper function to look into local storage and remove token if invalid

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedEpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingtime(storedEpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; //converts from false to true vice versa

  //local storage: stores simple data that survives when page reloaded (persistance)

  //local storage = synchronous API
  //when app starts I want to look in my local storage and see if token is there, and then use that token: initialize state with the token
  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    //check if logout timer is set and turn off when user logs out
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  //logout when logged in and inactive
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token); //built into browser
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingtime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

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
