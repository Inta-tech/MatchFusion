import React, { useState, useEffect } from 'react';
import MatchInsights from './components/MatchInsights';
import Community from './components/Community';
import AuthModal from './components/AuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('insights');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-wide text-blue-500">
            MATCH<span className="text-white">FUSION</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">CSE-3208 • Software Development Project - 1</p>
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeTab === 'insights' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              AI Insights
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeTab === 'community' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Community Hub
            </button>
          </nav>

          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <span className="text-xs font-semibold text-blue-400">@{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white px-2.5 py-1 rounded text-xs transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-xs font-semibold transition"
            >
              Login / Register
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {activeTab === 'insights' && <MatchInsights />}
        {activeTab === 'community' && <Community user={user} />}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />
    </div>
  );
}