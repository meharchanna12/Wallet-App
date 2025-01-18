import React, { useState } from "react";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import InputBox from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
      try {
          const response = await axios.post("http://localhost:4000/api/v1/user/register", {
              firstName,
              lastName,
              username,
              password,
          });

          alert("New User created")

          navigate("/signin");
      } catch (err) {
          console.error("Error during signup:", err);
      }
  };

  return (
      <div className="bg-slate-300 h-max flex justify-center items-center pt-[40px]">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
              <div className="text-center mb-6">
                  <Heading label="Sign up" />
                  <SubHeading label="Enter your information to create an account" />
              </div>

              <InputBox 
                  label="First Name" 
                  placeholder="John" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
              />
              <InputBox 
                  label="Last Name" 
                  placeholder="Doe" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
              />
              <InputBox 
                  label="Username" 
                  placeholder="john@example.com" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
              />
              <InputBox 
                  label="Password" 
                  placeholder="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
              />
              
              <Button label="Sign up" onClick={handleSignup} />
              
              <div className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <button 
                      className="pl-1 underline text-indigo-600 hover:text-indigo-800" 
                      onClick={() => navigate("/signin")}
                  >
                      Login
                  </button>
              </div>
          </div>
      </div>
  );
};

export default Signup;
