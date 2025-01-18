import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const [users, setUsers] = useState(""); // Keep your style
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users with filter:", filter);
                const response = await axios.get(`http://localhost:4000/api/v1/user/bulk?filter=${filter}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log("API Response:", response.data);
                setUsers(response.data.users || []);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error("Unauthorized! Redirecting to login...");
                    navigate("/login");
                } else {
                    console.error("Error fetching users:", error);
                }
            }
        };
    
        fetchUsers();
    }, [filter]);
    
    
    return (
        <>
            <div className="font-bold mt-6 text-lg">Users</div>
            <div className="my-2">
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => <User key={user._id} user={user} />)
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
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>

                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => {
                        navigate(`/send?id=${user._id}&name=${user.firstName}`);
                    }}
                >
                    Send Money
                </button>
            </div>
        </div>
    );
}
