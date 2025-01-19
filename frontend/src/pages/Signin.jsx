import React, { useState } from "react";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import InputBox from "../components/InputBox";
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
            const response = await axios.post("http://localhost:4000/api/v1/user/login", { username, password });
            console.log('Response Data:', response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("firstName",response.data.firstName);
            localStorage.setItem("userId",response.data.userId);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
                <div className="text-center mb-6">
                    <Heading label="Sign in" />
                    <SubHeading label="Enter your credentials to access your account" />
                </div>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <InputBox 
                    label="Email" 
                    placeholder="mehar@gmail.com" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <InputBox 
                    label="Password" 
                    placeholder="123456" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />

                <Button label="Sign in" onClick={signin} />

                <div className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <button 
                        className="pl-1 underline text-indigo-600 hover:text-indigo-800" 
                        onClick={() => navigate("/signup")}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
