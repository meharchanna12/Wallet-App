import React, { useState } from "react";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const signin = async () => {
        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/user/login",
                { username, password }
            );
            localStorage.setItem("token",response.data.token)
            navigate("/dashboard");
        } catch (err) {
            console.error("Error during signin:", err);
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="bg-white rounded-lg w-80 text-center p-3 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <InputBox
                        label={"Email"}
                        placeholder={"mehar@gmail.com"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <InputBox
                        label={"Password"}
                        placeholder={"123456"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="pt-4 ">
                        <Button label={"Sign in"} onClick={signin} />
                    </div>
                    <div className="text-black text-sm f" >
                      Don't have an account? 
                      <button className="pl-1 underline" onClick={()=>{navigate("/signup")}}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
