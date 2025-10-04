import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState({ id: "", username: "", password: "", firstName: "", lastName: "", email: "", role: "" });

  // Fetch all users
  // const fetchUsers = () => {
  useEffect(() => {
    fetch("http://localhost:8000/all-user/")
      .then((res) => res.json())
      .then((data) => {
        console.log('fetch all user data...',data);
        setUsers(data)
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);
  
  // Start editing a user
  const UpdateUser = (user) => {
    setUpdate(user.username);
    setFormData({
      id: user.id,
      username: user.username,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated user
  const updateUser = (username) => {
    fetch(`http://localhost:8000/single-user?username=${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers((prev) => prev.map((u) => (u.username === username ? { ...u, ...data } : u)));
        setUpdate(null);
        setFormData({ id: "", username: "", password: "", firstName: "", lastName: "", email: "", role: "" });
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  // Delete user
  const DeleteUser = (username) => {
    if (!window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      return;
    }

    fetch(
      `http://localhost:8000/all-user?username=${username}`,
      {
        method: "DELETE",
      }
    )
      .then(async (res) => {
        if (res.ok) {
          alert("User deleted successfully!");
        } else {
          const errorText = await res.text();
          alert(`Failed to delete user. Reason: ${errorText}`);
        }
      })
      .catch((err) =>
        alert(err,"Error deleting user. Possibly associated with other records.")
      );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <AdminMenu />
      <h1 className="text-2xl font-bold mb-4 text-center">All Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 border text-center">Username</th>
              <th className="px-4 py-2 border text-center">Password</th>
              <th className="px-4 py-2 border text-center">First Name</th>
              <th className="px-4 py-2 border text-center">Last Name</th>
              <th className="px-4 py-2 border text-center">Email</th>
              <th className="px-4 py-2 border text-center">Role</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200`}
                >
                  <td className="px-4 py-2 border text-center">
                    {user.username}
                  </td>

                  <td className="px-4 py-2 border text-center">
                    {update === user.username ? (
                      <input type="text" name="password" value={formData.password} onChange={handleChange} className="border px-2 py-1 rounded" />
                    ) : (
                      user.password
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {update === user.username ? (
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="border px-2 py-1 rounded" />
                    ) : (
                      user.firstName
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {update === user.username ? (
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="border px-2 py-1 rounded" />
                    ) : (
                      user.lastName
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {update === user.username ? (
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="border px-2 py-1 rounded" />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {update === user.username ? (
                      <input type="text" name="role" value={formData.role} onChange={handleChange} className="border px-2 py-1 rounded" />
                    ) : (
                      user.role ? user.role : "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    {update === user.username ? (
                      <>
                        <button
                          onClick={() => updateUser(user.username)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md shadow hover:bg-green-700 transition cursor-pointer mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setUpdate(null); setFormData({ id: "", username: "", password: "", firstName: "", lastName: "", email: "", role: "" }); }}
                          className="bg-gray-400 text-white px-3 py-1 rounded-md shadow hover:bg-gray-500 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => UpdateUser(user)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md shadow hover:bg-blue-700 transition cursor-pointer"
                      >
                        Update
                      </button>
                    )}
                    <button
                      onClick={() => DeleteUser(user.username)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md shadow hover:bg-red-700 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUser;