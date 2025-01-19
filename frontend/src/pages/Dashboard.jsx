import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Balance } from "../components/Balance";
import Users from "../components/Users";
import { Heading } from "../components/Heading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [balance, setBalance] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("firstName");
  const userId = localStorage.getItem("userId");
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
      localStorage.removeItem("firstName");
      localStorage.removeItem("userId");
      navigate("/signin");
  };

  return (
      <div className="bg-gray-100 min-h-screen text-gray-900">
          <header className="bg-indigo-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
              <div className="flex justify-between items-center">
                  <h1 className="text-lg font-bold">Payapp</h1>
                  <div className="relative">
                      <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 rounded-lg px-4 py-2 flex items-center"
                      >
                          <span className="text-white">{username}</span>  {/* Ensuring username is white */}
                      </button>

                      {isDropdownOpen && (
                          <div className="absolute bg-indigo-700 shadow-md rounded-lg mt-2 right-0 w-40">
                              <button className="block text-left px-4 py-2 hover:bg-indigo-800" onClick={() => navigate("/dashboard")}>Dashboard</button>
                              <button className="block text-left px-4 py-2 hover:bg-indigo-800" onClick={() => navigate("/transactions")}>My Transactions</button>
                              <button className="block text-left px-4 py-2 hover:bg-indigo-800" onClick={logout}>Sign out</button>
                          </div>
                      )}
                  </div>
              </div>
          </header>

          <div className="container mx-auto pt-24 pb-6">
              <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                  <div className="text-center mb-6">
                      <Heading label="Your Dashboard" />
                  </div>

                  <div className="mb-8 p-6 bg-indigo-50 rounded-lg shadow-md">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Balance</h2>
                      <Balance value={balance} />
                  </div>

                  <div className="p-6 bg-white rounded-lg shadow-md">
                      <Users />
                  </div>
              </div>
          </div>
      </div>
  );
}
