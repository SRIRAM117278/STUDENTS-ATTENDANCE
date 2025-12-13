import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import MarkAttendance from './pages/MarkAttendance'
import Reports from './pages/Reports'
import Enroll from './pages/Enroll'
import Layout from './components/Layout'

export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/add" element={<AddStudent />} />
        <Route path="/students/enroll" element={<Enroll />} />
        <Route path="/attendance/mark" element={<MarkAttendance />} />
        <Route path="/attendance/reports" element={<Reports />} />
      </Routes>
    </Layout>
  )
}
