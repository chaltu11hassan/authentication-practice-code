import React, { useContext } from "react";
//Navigate instead of redirect
import { Routes, Route} from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

//navigation guards
import AuthContext from "./store/Auth-Context";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        <Route path="/" exact element={<HomePage />} />

        {/* if user not logged in then send to login page */}
      <Route path="/auth" element={<AuthPage />} />

        {/* if user is logged in then give access to profile page */}

        {/* {authCtx.isLoggedIn && (
          <Route path="/profile" element={<UserProfile />} />
        )} */}

        <Route
          path="/profile"
          element={authCtx.isLoggedIn ? <UserProfile /> : <AuthPage/>}
        />

        <Route path="*" element={<HomePage/>} />

      </Routes>
    </Layout>
  );
}

export default App;
