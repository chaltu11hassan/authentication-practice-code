import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {

  const initialToken = localStorage.getItem("token");

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; //converts from false to true vice versa

  //local storage: stores simple data that survives when page reloaded (persistance)
  const loginHandler = (token) => {
    localStorage.setItem("token", token); //built into browser
    setToken(token);
  };

  //local storage = synchronous API
  //when app starts I want to look in my local storage and see if token is there, and then use that token: initialize state with the token
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
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
