import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { ChevronLeft, MessageSquare, ThumbsUp, ThumbsDown, Eye, Plus, Filter, Code } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Discussions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get('problemId');
  const { user } = useAuthStore();
  const [discussions, setDiscussions] = useState([]);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filterTag, setFilterTag] = useState('');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);

  const tags = ['Solution', 'Question', 'Bug', 'Optimization', 'Explanation'];

  useEffect(() => {
    if (problemId) {
      fetchProblem();
      fetchDiscussions();
    }
  }, [problemId, sortBy, filterTag]);

  const fetchProblem = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProblem(response.data);
    } catch (error) {
      console.error('Failed to fetch problem:', error);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `${API_URL}/discussions/problem/${problemId}?sortBy=${sortBy}`;
      if (filterTag) url += `&tag=${filterTag}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiscussions(response.data);
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (discussionId, voteType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/discussions/${discussionId}/${voteType}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDiscussions(prev =>
        prev.map(d =>
          d._id === discussionId
            ? { ...d, voteCount: response.data.voteCount, userVote: response.data.userVote }
            : d
        )
      );
    } catch (error) {
      console.error('Failed to vote:', error);
      toast.error('Failed to vote');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/problems')}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Discussions</h1>
              {problem && <p className="text-slate-400 text-sm">{problem.title}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              New Discussion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="mostVoted">Most Voted</option>
          </select>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Discussions List */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading discussions...</div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No discussions yet</p>
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              Start the first discussion
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div
                key={discussion._id}
                onClick={() => navigate(`/discussion/${discussion._id}`)}
                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-6 cursor-pointer transition-all"
              >
                <div className="flex gap-4">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(discussion._id, 'upvote');
                      }}
                      className={`p-2 rounded-lg transition ${
                        discussion.userVote === 'up'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className={`font-bold ${
                      discussion.voteCount > 0 ? 'text-green-400' :
                      discussion.voteCount < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {discussion.voteCount}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(discussion._id, 'downvote');
                      }}
                      className={`p-2 rounded-lg transition ${
                        discussion.userVote === 'down'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white hover:text-indigo-400 transition">
                        {discussion.title}
                      </h3>
                      {discussion.isSolution && (
                        <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-semibold">
                          Solution
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 mb-3 line-clamp-2">{discussion.content}</p>

                    {discussion.code && (
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                        <Code className="w-4 h-4" />
                        <span>Contains code snippet</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>by {discussion.user.username}</span>
                      <span>•</span>
                      <span>{formatDate(discussion.createdAt)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discussion.commentCount} comments</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{discussion.views} views</span>
                      </div>
                    </div>

                    {discussion.tags && discussion.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {discussion.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Discussion Modal */}
      {showNewDiscussion && (
        <NewDiscussionModal
          problemId={problemId}
          onClose={() => setShowNewDiscussion(false)}
          onSuccess={() => {
            setShowNewDiscussion(false);
            fetchDiscussions();
          }}
        />
      )}
    </div>
  );
}

function NewDiscussionModal({ problemId, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSolution, setIsSolution] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const tags = ['Solution', 'Question', 'Bug', 'Optimization', 'Explanation'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/discussions`,
        { problem: problemId, title, content, code, language, tags: selectedTags, isSolution },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Discussion created successfully');
      onSuccess();
    } catch (error) {
      console.error('Failed to create discussion:', error);
      toast.error('Failed to create discussion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold">New Discussion</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="What's your discussion about?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Describe your thoughts..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Code (Optional)</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-sm"
              placeholder="Paste your code here..."
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">Tags</label>
              <div className="flex gap-2 flex-wrap">
                {tags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isSolution"
                checked={isSolution}
                onChange={(e) => setIsSolution(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isSolution" className="text-sm">Mark as Solution</label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Discussion'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

