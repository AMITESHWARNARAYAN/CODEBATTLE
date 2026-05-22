import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Heart, MessageCircle, Eye, Clock, ChevronLeft, Plus, X, Search, Filter, Send, Building2, Briefcase, Tag, BookOpen, Trophy, ThumbsUp, ChevronDown, User, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['Interview Experience','Offer Letter','Rejection Story','Preparation Strategy','Career Switch','Internship Experience','Coding Round','System Design Round','HR Round','Tips & Advice','Success Story','Other'];
const OUTCOMES = ['Selected','Rejected','Pending','N/A'];

const CATEGORY_COLORS = {
  'Interview Experience': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Offer Letter': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Rejection Story': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Preparation Strategy': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Career Switch': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Internship Experience': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Coding Round': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'System Design Round': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'HR Round': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Tips & Advice': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'Success Story': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Other': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const OUTCOME_BADGE = {
  Selected: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'N/A': 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

export default function Stories() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const token = localStorage.getItem('token');

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [expandedStory, setExpandedStory] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ title:'', content:'', category:'Interview Experience', company:'', role:'', outcome:'N/A', tags:'', isAnonymous:false });

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15, sort });
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const { data } = await axios.get(`${API}/stories?${params}`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load stories'); }
    finally { setLoading(false); }
  }, [page, sort, category, search]);

  useEffect(() => { fetchStories(); }, [fetchStories]);
  useEffect(() => { setPage(1); }, [category, search, sort]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content required');
    setSubmitting(true);
    try {
      await axios.post(`${API}/stories`, { ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Story published!');
      setShowCreate(false);
      setForm({ title:'', content:'', category:'Interview Experience', company:'', role:'', outcome:'N/A', tags:'', isAnonymous:false });
      fetchStories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to publish'); }
    finally { setSubmitting(false); }
  };

  const handleLike = async (id) => {
    try {
      const { data } = await axios.post(`${API}/stories/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setStories(prev => prev.map(s => s._id === id ? { ...s, likesCount: data.likesCount, liked: data.liked } : s));
    } catch { toast.error('Failed to like'); }
  };

  const handleComment = async (id) => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API}/stories/${id}/comment`, { text: commentText }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentText('');
      // Refresh the expanded story
      const { data } = await axios.get(`${API}/stories/${id}`);
      setStories(prev => prev.map(s => s._id === id ? { ...s, comments: data.comments, commentsCount: data.comments.length } : s));
      toast.success('Comment added!');
    } catch { toast.error('Failed to comment'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await axios.delete(`${API}/stories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Story deleted');
      fetchStories();
    } catch { toast.error('Failed to delete'); }
  };

  const timeAgo = (d) => {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    if (s < 604800) return `${Math.floor(s/86400)}d ago`;
    return new Date(d).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" /> Developer Stories
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium text-sm hover:from-orange-600 hover:to-amber-600 transition shadow-lg">
              <Plus className="w-4 h-4" /> Share Your Story
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Share & Learn from Real Experiences</h2>
          <p className="text-gray-500 dark:text-gray-400">Interview stories, preparation tips, and career journeys from fellow developers</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories, companies..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-900 dark:text-white text-sm outline-none">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-gray-900 dark:text-white text-sm outline-none">
            <option value="newest">Newest</option>
            <option value="popular">Most Viewed</option>
            <option value="most-liked">Most Liked</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setCategory('')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${!category ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'}`}>All</button>
          {CATEGORIES.slice(0, 8).map(c => (
            <button key={c} onClick={() => setCategory(category === c ? '' : c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${category === c ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'}`}>{c}</button>
          ))}
        </div>

        {/* Stories List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-dark-800 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-dark-700 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-800">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No stories yet</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Be the first to share your experience!</p>
            <button onClick={() => setShowCreate(true)} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium text-sm">Share Your Story</button>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map(story => (
              <div key={story._id} className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                        {story.author?.username?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{story.author?.username || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(story.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {story.outcome && story.outcome !== 'N/A' && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${OUTCOME_BADGE[story.outcome]}`}>{story.outcome}</span>
                      )}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[story.category] || CATEGORY_COLORS.Other}`}>{story.category}</span>
                    </div>
                  </div>

                  {/* Title + Company */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer" onClick={() => setExpandedStory(expandedStory === story._id ? null : story._id)}>
                    {story.title}
                  </h3>
                  {(story.company || story.role) && (
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {story.company && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{story.company}</span>}
                      {story.role && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{story.role}</span>}
                    </div>
                  )}

                  {/* Content preview */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {expandedStory === story._id ? story.content : story.content?.substring(0, 250) + (story.content?.length > 250 ? '...' : '')}
                  </p>
                  {story.content?.length > 250 && (
                    <button onClick={() => setExpandedStory(expandedStory === story._id ? null : story._id)} className="text-orange-500 text-sm font-medium mb-4 hover:text-orange-600">
                      {expandedStory === story._id ? 'Show less' : 'Read more'}
                    </button>
                  )}

                  {/* Tags */}
                  {story.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {story.tags.map((t, i) => <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 rounded text-xs">#{t}</span>)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-5 pt-3 border-t border-gray-100 dark:border-dark-800">
                    <button onClick={() => handleLike(story._id)} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition">
                      <Heart className={`w-4 h-4 ${story.liked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{story.likesCount || 0}</span>
                    </button>
                    <button onClick={() => setExpandedStory(expandedStory === story._id ? null : story._id)} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition">
                      <MessageCircle className="w-4 h-4" />
                      <span>{story.commentsCount || 0}</span>
                    </button>
                    <span className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
                      <Eye className="w-4 h-4" />{story.views || 0}
                    </span>
                    {user && story.author?._id === user._id && (
                      <button onClick={() => handleDelete(story._id)} className="ml-auto text-xs text-red-400 hover:text-red-600">Delete</button>
                    )}
                  </div>

                  {/* Comments section (expanded) */}
                  {expandedStory === story._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-800">
                      {story.comments?.length > 0 && (
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {story.comments.map((c, i) => (
                            <div key={i} className="flex gap-2">
                              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 flex-shrink-0">
                                {c.user?.username?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="text-xs"><span className="font-semibold text-gray-900 dark:text-white">{c.user?.username || 'User'}</span> <span className="text-gray-400">{timeAgo(c.createdAt)}</span></p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{c.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleComment(story._id)} placeholder="Write a comment..." className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500" />
                        <button onClick={() => handleComment(story._id)} className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-orange-500 text-white' : 'bg-white dark:bg-dark-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Create Story Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-dark-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-dark-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Your Story</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., My Google L4 Interview Experience" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Outcome</label>
                  <select value={form.outcome} onChange={e => setForm({...form, outcome: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none">
                    {OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="e.g., Google, Amazon" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g., SDE-1, Frontend Dev" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Story *</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8} placeholder="Share the details of your experience..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500 resize-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="e.g., DSA, Arrays, DP, React" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isAnonymous} onChange={e => setForm({...form, isAnonymous: e.target.checked})} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Post anonymously</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-dark-800 transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50">
                  {submitting ? 'Publishing...' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
