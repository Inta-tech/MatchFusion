import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Community({ user }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [sportType, setSportType] = useState('FOOTBALL');
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await API.post('/posts', { content, sportType });
      setContent('');
      fetchPosts();
    } catch (err) {
      alert('Error creating post: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 max-w-xl mx-auto my-6 text-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-400 text-center">Community Hub</h2>

      {user ? (
        <form onSubmit={handleCreatePost} className="mb-6 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your match analysis or predictions..."
            className="w-full p-3 rounded bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none h-24"
            required
          />
          <div className="flex justify-between items-center">
            <select
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
              className="p-2 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none"
            >
              <option value="FOOTBALL">Football</option>
              <option value="CRICKET">Cricket</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold text-xs transition"
            >
              {loading ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-lg text-center text-sm text-slate-400 mb-6">
          Log in to join the conversation and publish posts.
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700/60">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-blue-400 text-sm">@{post.author?.username || 'User'}</span>
              <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                {post.sportType}
              </span>
            </div>
            <p className="text-slate-200 text-sm whitespace-pre-line">{post.content}</p>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-4">No community posts yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}