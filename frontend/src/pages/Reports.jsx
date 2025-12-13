/**
 * Attendance Reports Page
 * Shows attendance statistics and reports
 */
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getReport } from '../services/attendanceService';

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    loadReport();
  }, [fromDate, toDate]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await getReport({ from: fromDate, to: toDate });
      setReport(data);
    } catch (err) {
      console.error('Report error:', err);
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📈 Attendance Reports</h1>

      {/* Date Range Selector */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-4">Filter by Date Range</h2>
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      {report && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Class
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Total Days
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Present
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Absent
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {report.report?.map(item => (
                <tr key={item.student._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{item.student.name}</td>
                  <td className="px-6 py-3">{item.student.rollNumber}</td>
                  <td className="px-6 py-3">{item.student.className || '-'}</td>
                  <td className="px-6 py-3 text-center">{item.totalDays}</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">
                    {item.presentDays}
                  </td>
                  <td className="px-6 py-3 text-center text-red-600 font-semibold">
                    {item.absentDays}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${item.attendancePercentage}%`
                          }}
                        ></div>
                      </div>
                      <span className="font-semibold text-sm">
                        {item.attendancePercentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {report.report?.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No attendance records found for selected date range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}