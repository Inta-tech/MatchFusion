import React, { useEffect, useState } from 'react';
import API from '../api';

export default function LiveMatches({ onSelectMatch }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/matches/live')
      .then(res => setMatches(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-slate-400">Loading live matches...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 my-6">
      {matches.map(m => (
        <div key={m.fixture.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
          <div>
            <div className="font-bold text-sm text-slate-200">{m.teams.home.name} vs {m.teams.away.name}</div>
            <div className="text-xs text-blue-400 font-mono mt-1">Score: {m.goals.home} - {m.goals.away} ({m.fixture.status.elapsed}')</div>
          </div>
          <button
            onClick={() => onSelectMatch(m.teams.home.name, m.teams.away.name)}
            className="bg-blue-600 hover:bg-blue-500 text-xs text-white px-3 py-1.5 rounded font-semibold transition"
          >
            Analyze AI
          </button>
        </div>
      ))}
      {matches.length === 0 && <p className="text-center text-slate-500 text-sm col-span-2">No live matches in progress right now.</p>}
    </div>
  );
}