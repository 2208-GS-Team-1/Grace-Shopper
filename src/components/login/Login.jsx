import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetUser, setUser } from "../../store/userSlice";
import axios from "axios";
import "./login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const { user } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const onChange = ev => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };
  const logout = () => {
    window.localStorage.removeItem('token');
    dispatch(resetUser());
};

  const loginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const response = await axios.get("/api/auth", {
        headers: {
          authorization: token,
        },
      });

      dispatch(setUser(response.data));
    }
  };

  const attemptLogin = async event => {
    event.preventDefault();
    const response = await axios.post("/api/auth", credentials);
    const token = response.data;
    window.localStorage.setItem("token", token);

    loginWithToken(token);
  };
  if(user.id) return (
    <div>
        Welcome {user.firstName} {user.lastName}
    <button
    onClick={logout}
    >
        log out
    </button>
    <Link
    to='/usercart'
    >
    <button>
        View Cart
    </button>
    </Link>
    </div>
    )
  return (
    <div className="loginForm">
      <h2>Login</h2>
      <form onSubmit={attemptLogin}>
        <input
          placeholder="username"
          value={credentials.username}
          name="username"
          onChange={onChange}
        />
        <input
          placeholder="password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={onChange}
        />
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
