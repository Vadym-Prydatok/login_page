import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LogIn = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setMessageError] = useState("");

  useEffect(() => {
    const timeoutForErrorNotice = setTimeout(() => setMessageError(""), 3000);

    return () => {
      clearTimeout(timeoutForErrorNotice);
    };
  }, [errorMessage]);

  const onSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch(
        "http://146.190.118.121/api/login/",
        requestOptions
      );
      const data = await response.json();

      if (data.message === "Authentication successful.") {
        setIsAuthenticated(true);

        navigate("/main");
      }

      setMessageError(data.error);

      console.log("Відповідь сервера:", data);
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  return (
    <div>
      <h1>{isAuthenticated ? 'Log In' : 'Log Out'}</h1>
      <form className="signInForm">
        <input
          type="text"
          placeholder="Login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={(e) => onSubmit(e)}>
          Sign In
        </button>
      </form>

      {errorMessage && <div>{errorMessage}</div>}

      <button onClick={() => navigate("/main")}>Go Forward</button>
    </div>
  );
};
