import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    firstname: "",
    lastname: "",
    role: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const inputHandle = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  
  async function submitHandle(e) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/register-user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          passwordConfirm: form.passwordConfirm,
          firstName: form.firstname,
          lastName: form.lastname,
          role: form.role
        })
      });
      const data = await response.json();
      console.log("Response:", data); // debug

      if (!response.ok) throw new Error(data.detail || "Registration failed");

      setSuccess(`Registered OK — welcome ${data.username}`);
      setForm({
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        firstname: "",
        lastname: "",
        role: ""
      });
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(error.message || "Register failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <form onSubmit={submitHandle} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">Register</h2>
        <div className="flex flex-col gap-2">

          <label htmlFor="username" className="text-sm font-medium text-gray-700">UserName</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={inputHandle}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required 
            />
          
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={inputHandle} 
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required 
            />

          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={inputHandle} 
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required minLength={6} 
            />
          
          <label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={inputHandle}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required minLength={6}
            />

          <label htmlFor="firstname" className="text-sm font-medium text-gray-700">FirstName</label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={inputHandle}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required 
            />

          <label htmlFor="lastname" className="text-sm font-medium text-gray-700">LastName</label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={inputHandle}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required 
            />

          <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={inputHandle}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
            </select>
        </div>

          {error && <div className="mb-3 text-red-700 bg-red-100 p-2 rounded">{error}</div>}
          {success && <div className="mb-3 text-green-700 bg-green-100 p-2 rounded">{success}</div>}

        <button type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="mt-4 text-center">
            <a href="/login" className="text-blue-600 hover:underline">
              I have an account? Login
            </a>
        </div>
      </form>
    </div>
  );
}

export default Register;
