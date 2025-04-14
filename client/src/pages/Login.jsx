import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import axios from "axios";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const onSubmiHandler = async(e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "api/auth/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setIsLoggedin(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "api/auth/login", {
          email,
          password,
        });
        if (data.success) {

          setIsLoggedin(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
        console.log(error); // <-- log full error
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        toast.error(errorMessage);
    }
  };



  return (
    <div
      className="flex items-center justify-center min-h-screen px-6 sm:px-0
    bg-gradient-to-br from-blue-200 to-purple-400"
    >
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5
      w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your Account"
            : "Login to your account!"}
        </p>
        <form onSubmit={onSubmiHandler}>
          {state === "Sign Up" && (
            <div
              className="mb-4 flex items-center gap-3 w-full px-5 py-2.5
                   rounded-full bg-[#333a5c]"
            >
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div
            className="mb-4 flex items-center gap-3 w-full px-5 py-2.5
            rounded-full bg-[#333a5c]"
          >
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              placeholder="Email id"
              required
            />
          </div>

          <div
            className="mb-4 flex items-center gap-3 w-full px-5 py-2.5
            rounded-full bg-[#333a5c]"
          >
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forget Password ?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>
        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="underline cursor-pointer text-blue-400"
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="underline cursor-pointer text-blue-400"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
