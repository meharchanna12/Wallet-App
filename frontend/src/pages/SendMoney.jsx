import { useSearchParams } from "react-router-dom";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { useState } from "react";
import axios from "axios";

const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");

    // Function to initiate the money transfer
    const transferMoney = async () => {
        if (!amount || amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/account/transfer", // Replace with the correct endpoint for transfer
                {
                    to: id,
                    amount: amount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            alert("Transfer successful!");
            // Handle any redirection or further steps after successful transfer
        } catch (err) {
            console.error("Error during transfer:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="bg-gray-100 h-screen flex justify-center items-center py-12 px-6">
            <div className="bg-white rounded-lg w-full sm:w-96 p-6 shadow-lg">
                <Heading label={"Send Money"} className="text-3xl font-semibold text-gray-800 mb-4 text-center" />

                <div className="flex items-center mb-6">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                        {name[0]}
                    </div>
                    <div className="font-bold text-lg text-gray-800">{name}</div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <InputBox
                    label={"Amount (in Rs)"}
                    placeholder={"Enter amount"}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mb-4"
                    type="number" // Set input type to number for amount
                />

                <Button
                    label={"Initiate Transfer"}
                    onClick={transferMoney}
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                />
            </div>
        </div>
    );
};

export default SendMoney;
