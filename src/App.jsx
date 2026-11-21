
import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import StudentFormPage from './pages/StudentFormPage';

import './App.css';

// Local storage key
const STORAGE_KEY = 'student-management-students';

// Load students from local storage
function getSavedStudents() {
  try {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    return savedStudents ? JSON.parse(savedStudents) : [];
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
}

function App() {
  // Student list state
  const [students, setStudents] = useState(getSavedStudents);

  // Save students whenever the list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Get current URL path
  const path = window.location.pathname;

  // Find student for editing
  const editMatch = path.match(/^\/edit\/([^/]+)$/);

  const studentToEdit = editMatch
    ? students.find(
        (student) => student.id === decodeURIComponent(editMatch[1])
      )
    : null;

  // Add a new student
  function addStudent(studentDetails) {
    const newStudent = {
      ...studentDetails,
      id: Date.now().toString(),
    };

    setStudents((previousStudents) => [
      ...previousStudents,
      newStudent,
    ]);

    window.location.href = '/students';
    Console.log('add student data:',updatedStudent)
  }

  // Update existing student
  function updateStudent(updatedStudent) {
    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student.id === updatedStudent.id
          ? updatedStudent
          : student
      )
    );

    window.location.href = '/students';
  }

  // Delete student
  function deleteStudent(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (confirmDelete) {
      setStudents((previousStudents) =>
        previousStudents.filter(
          (student) => student.id !== id
        )
      );
    }
  }

  // Select page based on URL
  let page;

  if (path === '/students') {
    page = (
      <StudentsPage
        students={students}
        onDelete={deleteStudent}
      />
    );
  } else if (path === '/add-student') {
    page = (
      <StudentFormPage
        onSave={addStudent}
      />
    );
  } else if (editMatch && studentToEdit) {
    page = (
      <StudentFormPage
        student={studentToEdit}
        onSave={updateStudent}
      />
    );
  } else {
    page = (
      <HomePage
        studentCount={students.length}
      />
    );
  }

  // Main application layout
  return (
    <>
      <Navbar />
      {page}
    </>
  );
}

export default App;
