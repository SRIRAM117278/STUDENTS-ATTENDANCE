import React from 'react'

export default function Navbar(){
  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
      <div className="text-xl font-medium">Students Attendance</div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-500">Admin</div>
      </div>
    </header>
  )
}
