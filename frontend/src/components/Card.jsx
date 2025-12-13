import React from 'react'

export default function Card({ title, value, children }){
  return (
    <div className="card">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}{children}</div>
    </div>
  )
}
