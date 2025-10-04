import { useEffect, useState } from "react";
import FacultyMenu from "./FacultyMenu";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [updataStudent, setUpdataStudent] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "", email: "" });

  // Fetch all students (single useEffect)
  useEffect(() => {
    fetch("http://localhost:8000/add-student/")
      .then((res) => res.json())
      .then((data) =>{
        console.log('fetch data...',data);
        setStudents(data)
      })
      .catch((err) => console.error("API error:", err));
  }, []);


  // Delete student
  const deleteStudent = (id) => {
    fetch(`http://localhost:8000/detail-student/${id}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Student deleted successfully");
          console.log("Deleted student ID:", id);
          setStudents((prev) => prev.filter((s) => s.id !== id));
        } else {
          alert("Failed to delete student");
        }
      })
      .catch((err) => console.error("Error deleting student:", err));
  };

  // Handle edit click
  const startUpdata = (student) => {
    setUpdataStudent(student.id);
    setFormData({ id: student.id, name: student.name, email: student.email });
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated student
  const updateStudent = (id) => {
    fetch(`http://localhost:8000/detail-student/${id}/`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then((updated) => {
        setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
        console.log("Updated student:", updated);
        setUpdataStudent(null);
      })
      .catch((err) => console.error("Error updating student:", err));
  };

  // Fetch a single student by ID (example usage: call this function as needed)
  const fetchSingleStudent = (id) => {
    fetch(`http://localhost:8000/detail-student/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        alert(`Student: ID=${data.id}, Name=${data.name}, Email=${data.email}`);
      })
      .catch((err) => console.error("Error fetching single student:", err));
  };
  

  return (
    <>
      <FacultyMenu />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">All Students</h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="text-center">
                <td className="border px-4 py-2">{student.id}</td>
                <td className="border px-4 py-2">
                  {updataStudent === student.id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    student.name
                  )}
                </td>
                <td className="border px-4 py-2">
                  {updataStudent === student.id ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    student.email
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  {updataStudent === student.id ? (
                    <button
                      onClick={() => updateStudent(student.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startUpdata(student)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => fetchSingleStudent(student.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AllStudents;