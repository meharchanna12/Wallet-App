import React, { useState } from "react";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        {
          firstName,
          lastName,
          username,
          password,
        }
        
      );
      navigate("/dashboard")
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            label={"First Name"}
            value={firstName}
          />
          <InputBox
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            label={"Last Name"}
            value={lastName}
          />
          <InputBox
            onChange={(e) => setusername(e.target.value)}
            placeholder="john@example.com"
            label={"username"}
            value={username}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            label={"Password"}
            type="password"
            value={password}
          />
          <div className="pt-4">
            <Button onClick={handleSignup} label={"Sign up"} />
          </div>
          <div className="text-black text-sm py-1" >
              Already have an account? 
              <button className="pl-1 underline" onClick={()=>{navigate("/signin")}}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
