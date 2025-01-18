import { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/v1/account/transactions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const sentTransactions = response.data.sentTransactions || [];
        const receivedTransactions = response.data.receivedTransactions || [];

        const combinedTransactions = [
          ...sentTransactions.map((transaction) => ({
            ...transaction,
            type: "Sent",
          })),
          ...receivedTransactions.map((transaction) => ({
            ...transaction,
            type: "Received",
          })),
        ];

        setSent(sentTransactions);
        setReceived(receivedTransactions);
        setTransactions(combinedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Error fetching transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading transactions...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "Invalid Date" : parsedDate.toLocaleDateString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6 font-bold text-2xl text-center text-indigo-600">Transactions</div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left font-medium">Amount</th>
                <th className="py-4 px-6 text-left font-medium">Type</th>
                <th className="py-4 px-6 text-left font-medium">Date</th>
                <th className="py-4 px-6 text-left font-medium">Recipient/Sender</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-indigo-50 transition duration-150`}
                  >
                    <td className="py-4 px-6 text-gray-700">{transaction.amount}</td>
                    <td
                      className={`py-4 px-6 font-semibold ${
                        transaction.type === "Sent" ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {transaction.type}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{formatDate(transaction.date)}</td>
                    <td className="py-4 px-6 text-gray-700">
                      {transaction.type === "Sent"
                        ? transaction.to?.firstName || "Unknown"
                        : transaction.from?.firstName || "Unknown"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 px-6 text-center text-gray-500">
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
