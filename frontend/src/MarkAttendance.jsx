import { useEffect, useState } from "react";
import FacultyMenu from "./FacultyMenu";
import AdminMenu from "./AdminMenu";

const API = "http://localhost:8000";

export default function AddAttendance() {
  const role = localStorage.getItem("role");          // "admin" | "faculty"
  const username = localStorage.getItem("username");  // used when role === "faculty"

  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [faculty, setFaculty] = useState(role === "faculty" ? username : "");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role === "admin") {
      fetch(`${API}/faculty_all/`).then(r => r.json()).then(setFaculties);
    }
    fetch(`${API}/add-subject/`).then(r => r.json()).then(setSubjects);
    fetch(`${API}/students_all/`).then(r => r.json()).then(setStudents);
  }, [role]);

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!faculty || !subject || !date || !time || selectedStudents.length === 0) {
      alert("Select faculty, subject, date, time and at least one student.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        faculty,                 // username
        subject: Number(subject),// subject id
        students: selectedStudents,
        date,                    // YYYY-MM-DD
        time,                    // "10:00" or "10:00am" (string)
        number_of_students: selectedStudents.length,
      };

      const res = await fetch(`${API}/add-attendance/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      // reset
      setSubject("");
      setDate("");
      setTime("");
      setSelectedStudents([]);
      alert("Attendance saved!");
    } catch (e) {
      console.error(e);
      alert("Error saving attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}

      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex justify-center py-8">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">Add Attendance</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {role === "admin" && (
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Faculty</label>
                <select className="border rounded px-3 py-2"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}>
                  <option value="">Choose Faculty</option>
                  {faculties.map((f) => (
                    <option key={f.username} value={f.username}>
                      {f.firstName} {f.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {role === "faculty" && (
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Faculty</label>
                <input className="border rounded px-3 py-2 bg-gray-100"
                       value={faculty} disabled />
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Subject</label>
              <select className="border rounded px-3 py-2"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}>
                <option value="">Choose Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Date</label>
              <input type="date" className="border rounded px-3 py-2"
                     value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Time</label>
              <input type="time" className="border rounded px-3 py-2"
                     value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Select Students</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {students.map((st) => (
                <label key={st.id} className="flex items-center gap-2 border rounded px-3 py-2">
                  <input type="checkbox"
                         checked={selectedStudents.includes(st.id)}
                         onChange={() => toggleStudent(st.id)} />
                  <span>{st.name} <span className="text-gray-500 text-xs">({st.email})</span></span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </>
  );
}


