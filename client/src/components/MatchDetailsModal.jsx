import React, { useEffect, useState } from 'react';
import API from '../api';

export default function MatchDetailsModal({ fixtureId, onClose }) {
  const [lineups, setLineups] = useState([]);
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const [lineupRes, injuryRes] = await Promise.all([
          API.get(`/matches/${fixtureId}/lineups`),
          API.get(`/matches/${fixtureId}/injuries`)
        ]);
        setLineups(lineupRes.data);
        setInjuries(injuryRes.data);
      } catch (err) {
        console.error("Error loading match details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [fixtureId]);

  if (loading) return <div className="p-4 text-white">Loading match details...</div>;

  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-slate-100 max-w-2xl mx-auto my-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Match Center & Lineups</h2>
        <button onClick={onClose} className="text-red-400 text-sm font-bold">Close</button>
      </div>

      {/* Squad / Playing XI Section */}
      <div className="grid grid-cols-2 gap-4">
        {lineups.map((teamData) => (
          <div key={teamData.team.id} className="bg-slate-800 p-3 rounded-lg">
            <h3 className="font-bold text-blue-400 mb-2">{teamData.team.name} ({teamData.formation})</h3>
            <p className="text-xs text-slate-400 mb-1 font-semibold">Starting XI:</p>
            <ul className="text-xs space-y-1">
              {teamData.startXI.map(({ player }) => (
                <li key={player.id}>#{player.number} {player.name} ({player.pos})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Injuries Section */}
      <div className="mt-4 bg-red-950/30 border border-red-800/50 p-3 rounded-lg">
        <h3 className="font-bold text-red-400 text-sm mb-2">Injuries & Absences</h3>
        {injuries.length === 0 ? (
          <p className="text-xs text-slate-400">No reported injuries for this match.</p>
        ) : (
          <ul className="text-xs space-y-1 text-red-200">
            {injuries.map((item, idx) => (
              <li key={idx}>⚠️ <strong>{item.player.name}</strong> ({item.team.name}) - {item.player.reason}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}