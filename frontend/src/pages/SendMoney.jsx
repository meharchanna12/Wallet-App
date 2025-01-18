import { useNavigate, useSearchParams } from "react-router-dom";
import { Heading } from "../components/Heading";
import  InputBox  from "../components/InputBox";
import { Button } from "../components/Button";
import { useState } from "react";
import axios from "axios";

const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const transferMoney = async () => {
        if (!amount || amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/account/transfer",
                { to: id, amount: amount },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            alert("Transfer successful!");
            navigate("/dashboard");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="bg-indigo-100 h-screen flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full sm:w-96 shadow-lg">
                <Heading label="Send Money" />
                <div className="flex items-center mb-6 pt-4">
                    <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold mr-4">{name[0]}</div>
                    <div className="font-semibold text-lg text-gray-800">{name}</div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <InputBox label="Amount (in Rs)" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <Button label="Initiate Transfer" onClick={transferMoney} />
            </div>
        </div>
    );
};
export default SendMoney;