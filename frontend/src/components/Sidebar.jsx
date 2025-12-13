import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, UserGroupIcon, ClipboardDocumentCheckIcon, ChartBarIcon, PlusIcon } from '@heroicons/react/24/outline'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/students', label: 'Students', icon: UserGroupIcon },
  { to: '/students/add', label: 'Add Student', icon: PlusIcon },
  { to: '/students/enroll', label: 'Enroll Faces', icon: PlusIcon },
  { to: '/attendance/mark', label: 'Mark Attendance', icon: ClipboardDocumentCheckIcon },
  { to: '/attendance/reports', label: 'Reports', icon: ChartBarIcon },
]

export default function Sidebar(){
  const loc = useLocation();
  return (
    <aside className="w-64 bg-gradient-to-b from-sky-600 to-violet-600 text-white p-4">
      <div className="text-2xl font-semibold mb-6">Attendance</div>
      <nav className="space-y-2">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition ${loc.pathname.startsWith(l.to) ? 'bg-white/10' : ''}`}>
            <l.icon className="w-5 h-5" />
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
