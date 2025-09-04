import { useState } from "react";
import image from "../assets/image.jpg";
import { RegisterNewUser, HandleLogin } from "../context/apiManager";

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false); // false = login, true = register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  // const [loginStatus , setLoginStatus] = useState(false);

  //Regex for username , password and email validations
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors = {};
    //checking if the action was for registering or logging in
    if (isRegister) {
      if (!usernameRegex.test(username)) {
        newErrors.username =
          "Username must be 3-16 characters long and contain only letters, numbers, or underscores.";
      }

      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Password must be 8-64 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).";
      }

      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (isRegister) {
      const result = RegisterNewUser({ username, password, email });
      if (result?.success) {
        onLoginSuccess();
      }
    } else {
      const result = await HandleLogin({ username, password });
      console.log(result);
      if (result?.success) {
        onLoginSuccess(); 
      }
    }
    }
  };
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div
          className="col-md-7 d-none d-md-block p-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-white text-center start-0 p-3">
            <h1
              className="display-4 font-weight-bold"
              style={{ fontFamily: "Georgia, serif", letterSpacing: "2px" }}
            >
              <span style={{ color: "#66fcf1" }}>Task</span> Book
              <i
                className="bi bi-journal-check"
                style={{ fontSize: "0.8em", marginLeft: "10px" }}
              ></i>
            </h1>
          </div>
        </div>

        <div
          className="col-md-5 d-flex align-items-center justify-content-center"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="card shadow p-4 w-75">
            <h3 className="text-center mb-4">
              {isRegister ? "Register" : "Login"}
            </h3>

            <form onSubmit={handleSubmit}>
              {isRegister && (
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

              {/* Password */}
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

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100">
                {isRegister ? "Register" : "Login"}
              </button>
            </form>

            {/* Toggle Link */}
            <div className="text-center mt-3">
              <small>
                {isRegister ? (
                  <>
                    Already have an account?{" "}
                    <button
                      className="btn btn-link p-0"
                      onClick={() => setIsRegister(false)}
                    >
                      Login
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
      </div>
    </div>
  );
}

export default Login;
