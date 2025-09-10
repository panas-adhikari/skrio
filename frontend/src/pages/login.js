import { useState } from "react";
import image from "../assets/image.jpg";
import { RegisterNewUser, HandleLogin } from "../context/apiManager";

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(null);

  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_.])[A-Za-z\d@$!%*?&]{8,64}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearForm() {
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setErrors({});
    setUsername("");
    setLoginError(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (isRegister) {
      if (!usernameRegex.test(username)) {
        newErrors.username =
          "Username must be 3–16 characters long and contain only letters, numbers, or underscores.";
      }
      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Password must be 8–64 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).";
      }
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (isRegister) {
        const result = await RegisterNewUser({ username, password, email });
        if (result?.success) {
          setIsRegister(false);
          console.log("User Registered");
          clearForm();
          onLoginSuccess();
        }else{
          setErrors({registerError:result.message})
        }
      } else {
        const result = await HandleLogin({ username, password });
        if (result.success) {
          clearForm();
          onLoginSuccess();
        } else {
          setLoginError("The Username or Password does not match");
        }
      }
    }
  };

  const passwordMatchStatus = () => {
    if (!isRegister || confirmPassword === "") return null;
    if (confirmPassword === password) {
      return <p style={{ color: "green", fontSize: "0.9rem" }}>Passwords match</p>;
    } else {
      return <p style={{ color: "red", fontSize: "0.9rem" }}>Passwords do not match</p>;
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">
          {isRegister ? "Register" : "Login Now"}
        </h3>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <p style={{ color: "red" }}>{errors.email}</p>
                )}
              </div>
            </>
          )}

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <p style={{ color: "red" }}>{errors.username}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password}</p>
            )}
          </div>

          {isRegister && (
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordMatchStatus()}
              {errors.confirmPassword && (
                <p style={{ color: "red" }}>{errors.confirmPassword}</p>
              )}
              {errors.registerError &&(
                <p style={{ color: "red" }}>{errors.registerError}</p>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setIsRegister(false)}
                >
                  Login Now
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => setIsRegister(true)}
                >
                  Register
                </button>
              </>
            )}
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
