// src/ViewAttendance.jsx
import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import FacultyMenu from "./FacultyMenu";

const API = "http://localhost:8000";

function ViewAttendance() {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [selectedFaculty, setSelectedFaculty] = useState(role === "faculty" ? username : "");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (role === "admin") {
      fetch(`${API}/faculty_all/`).then(r => r.json()).then(setFaculties);
    }
    fetch(`${API}/add-subject/`).then(r => r.json()).then(setSubjects);
  }, [role]);

  const fetchAllAttendance = () => {
    fetch(`${API}/add-attendance/`)
      .then((res) => res.json())
      .then(setAttendance)
      .catch((err) => console.error("Error fetching all attendance:", err));
  };

  const fetchFilteredAttendance = () => {
    let url = `${API}/add-attendance/`;
    const params = new URLSearchParams();
    if (selectedFaculty) params.append("faculty", selectedFaculty);
    if (selectedSubject) params.append("subject", selectedSubject);
    if (selectedDate) params.append("date", selectedDate);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then(setAttendance)
      .catch((err) => console.error("Error fetching filtered attendance:", err));
  };

  const handleShowStudents = (studentsList) => {
    setStudents(studentsList || []);
    setShowModal(true);
  };

  return (
    <>
      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}

      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col items-center py-8">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
            <div className="flex flex-col">
              {role === "admin" ? (
                <>
                  <label className="text-sm font-medium mb-1">Select Faculty</label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">Choose Faculty</option>
                    {faculties.map((f) => (
                      <option key={f.username} value={f.username}>
                        {f.firstName} {f.lastName}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label className="text-sm font-medium mb-1">Faculty</label>
                  <input className="border rounded px-3 py-2 bg-gray-100" value={selectedFaculty} disabled />
                </>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">Choose Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              {role === "admin" && (
                <button
                  onClick={fetchAllAttendance}
                  className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Show All
                </button>
              )}
              <button
                onClick={fetchFilteredAttendance}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Show
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Faculty</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Number of Students</th>
                  <th className="px-4 py-2">Show Students</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(attendance) && attendance.length > 0 ? (
                  attendance.map((a, index) => (
                    <tr key={a.id || index} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{a.id}</td>
                      <td className="px-4 py-2">
                        {a.faculty?.firstName} {a.faculty?.lastName}
                      </td>
                      <td className="px-4 py-2">{a.subject?.name}</td>
                      <td className="px-4 py-2">{a.date}</td>
                      <td className="px-4 py-2">{a.time}</td>
                      <td className="px-4 py-2">{a.number_of_students}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleShowStudents(a.students)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                        >
                          Show
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-[32rem]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Students</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">✕</button>
              </div>
              {students?.length ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-3 py-2">ID</th>
                      <th className="text-left px-3 py-2">Name</th>
                      <th className="text-left px-3 py-2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-b">
                        <td className="px-3 py-2">{s.id}</td>
                        <td className="px-3 py-2">{s.name}</td>
                        <td className="px-3 py-2">{s.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No students found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewAttendance;
