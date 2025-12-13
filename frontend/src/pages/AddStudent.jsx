import React, { useState } from 'react'
import { createStudent } from '../services/studentService'
import toast from 'react-hot-toast'

export default function AddStudent(){
  const [form, setForm] = useState({ name: '', rollNumber: '', className: '' })
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    try{
      setLoading(true)
      const payload = { name: form.name, rollNumber: form.rollNumber, className: form.className }
      await createStudent(payload)
      toast.success('Student added')
      setForm({ name: '', rollNumber: '', className: '' })
    }catch(err){
      toast.error(err.response?.data?.message || 'Error')
    }finally{ setLoading(false) }
  }

  return (
    <div className="card max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Add Student</h2>
      <form onSubmit={handle} className="space-y-3">
        <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" className="w-full p-2 border rounded" />
        <input required value={form.rollNumber} onChange={e=>setForm({...form,rollNumber:e.target.value})} placeholder="Roll number" className="w-full p-2 border rounded" />
        <input value={form.className} onChange={e=>setForm({...form,className:e.target.value})} placeholder="Class (e.g. 10A)" className="w-full p-2 border rounded" />
        <button disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded">{loading? 'Saving...' : 'Add Student'}</button>
      </form>
    </div>
  )
}
