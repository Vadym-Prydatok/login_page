import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout, selectIsAuthenticated } from "../app/authSlice";
import { RootState } from "../app/store";
import { useTransition, animated } from "react-spring";
import classNames from "classnames";

export const LogIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setMessageError] = useState("");

  const currentPage = useSelector((state: RootState) => state.pagination.currentPage);

  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const timeoutForErrorNotice = setTimeout(() => setMessageError(""), 3000);

    return () => {
      clearTimeout(timeoutForErrorNotice);
    };
  }, [errorMessage]);

  const transitions = useTransition(errorMessage, {
    from: { opacity: 0, transform: "translateX(-100%)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateX(100%)" },
  });

  const onSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!username.trim().length) {
      setMessageError(`Username can't be empty`)

      return;
    }

    if (!password.trim().length) {
      setMessageError(`Password can't be empty`)

      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch(
        "https://technical-task-api.icapgroupgmbh.com/api/login/",
        requestOptions
      );
      const data = await response.json();

      if (data.message === "Authentication successful.") {
        dispatch(login());
        navigate(`/main/${currentPage}`);
      }

      setMessageError(data.error);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h1 className={classNames({ 'active': isAuthenticated })}>{isAuthenticated ? "Log In" : "Log Out"}</h1>
      <form className="form">
        <div className="form-group">
          <label htmlFor="username">Username</label>

          <input
            name="username"
            id="username"
            type="text"
            placeholder="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <input
            name="password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="showPassword"><img src="/eye.svg" alt="eye" /></button>
        </div>

        <button type="submit" onClick={(e) => onSubmit(e)} className="submit_button">
          Sign In
          <span className="pulse"></span>
        </button>

        {transitions(
        (style, item) =>
          item && (
            <animated.div className="notice" style={style}>
              {item}
            </animated.div>
          )
      )}
      </form>

      {isAuthenticated && <button onClick={() => navigate(`/main/${currentPage}`)}>Go Forward</button>}
      {isAuthenticated && <button onClick={() => dispatch(logout())}>Log out</button>}
    </div>
  );
};
