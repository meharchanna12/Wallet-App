import { Balance } from "../components/Balance";
import Users from "../components/Users";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [balance, setBalance] = useState("");
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const username = storedUser ? storedUser.name : 'User'; // Fallback in case user is not available
  console.log(username);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/account/balance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pt-20">
      <div className="bg-blue-600 text-white w-full shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Payapp</h1>
          <div className="flex justify-between">
            <button
              onClick={logout}
              className="pr-2"
            >
              Logout
            </button>
            <span className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-semibold">
            {username[0]}
            </span>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-24">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800">Your Dashboard</h1>
            <p className="text-lg text-gray-500">Manage your account, balance, and users.</p>
          </div>

          <div className="mb-8 p-6 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Balance</h2>
            <Balance value={balance} />
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
            <Users />
          </div>
        </div>
      </div>
    </div>
  );
}
