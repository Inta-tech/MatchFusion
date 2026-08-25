import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api';

const COLORS = ['#3b82f6', '#eab308', '#f97316'];

export default function MatchInsights() {
  const [teamA, setTeamA] = useState('Real Madrid');
  const [teamB, setTeamB] = useState('Barcelona');
  const [sport, setSport] = useState('Football');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  const fetchInsights = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/ai/match-insights', { teamA, teamB, sport });
      setInsights(res.data.insights);
    } catch (err) {
      alert('Error fetching AI insights: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const chartData = insights ? [
    { name: teamA, value: insights.probA },
    { name: 'Draw', value: insights.probDraw },
    { name: teamB, value: insights.probB },
  ] : [];

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 max-w-xl mx-auto my-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-400 text-center">AI Match Insights</h2>

      <form onSubmit={fetchInsights} className="space-y-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            placeholder="Team A"
            className="w-1/2 p-2 rounded bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            placeholder="Team B"
            className="w-1/2 p-2 rounded bg-slate-900 border border-slate-700 text-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex gap-4 items-center justify-between">
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="p-2 rounded bg-slate-900 border border-slate-700 text-sm focus:outline-none"
          >
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold text-sm transition"
          >
            {loading ? 'Analyzing...' : 'Generate Insights'}
          </button>
        </div>
      </form>

      {insights && (
        <div className="mt-6 border-t border-slate-700 pt-4">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around my-2 text-sm font-semibold">
            <span className="text-blue-400">{teamA}: {insights.probA}%</span>
            <span className="text-yellow-400">Draw: {insights.probDraw}%</span>
            <span className="text-orange-400">{teamB}: {insights.probB}%</span>
          </div>

          <div className="mt-4 bg-slate-900 p-3 rounded-lg text-sm">
            <h4 className="font-bold mb-2 text-slate-300">Tactical Insights:</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              {insights.insights?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}