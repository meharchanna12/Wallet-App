import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const [users, setUsers] = useState([]); // Initialize as an array
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/api/v1/user/bulk?filter=${filter}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setUsers(response.data.users || []); // Safely handle missing `users` field
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [filter]);

    return (
        <>
            <div className="font-semibold mt-6 text-xl text-gray-800 pb-6">Users</div>
            <div className="my-4">
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-4 py-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div>
                {Array.isArray(users) && users.length > 0 ? (
                    users
                        .map((user) => <User key={user._id} user={user} />)
                ) : (
                    <div>No users found.</div>
                )}
            </div>
        </>
    );
}

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center py-3 px-4 border-b">
            <div className="flex items-center">
                <div className="rounded-full h-12 w-12 bg-gray-300 flex justify-center items-center text-xl font-semibold text-white mr-3">
                    {user.firstName?.[0] || "?"}
                </div>
                <div className="font-medium text-gray-800">
                    {user.firstName || "Unknown"} {user.lastName || "User"}
                </div>
            </div>
            <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName}`)}
            >
                Send Money
            </button>
        </div>
    );
}
