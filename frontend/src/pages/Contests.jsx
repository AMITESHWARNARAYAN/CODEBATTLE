import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContestStore } from '../store/contestStore';
import { Trophy, Calendar, Clock, Users, ArrowRight, ChevronLeft, Bell, ChevronDown, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

export default function Contests() {
  const navigate = useNavigate();
  const { getUpcomingContests, getRunningContests, getPastContests, loading } = useContestStore();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [runningContests, setRunningContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [timers, setTimers] = useState({});

  useEffect(() => { loadContests(); }, []);

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = {};
      [...upcomingContests, ...runningContests].forEach(c => {
        const target = c.status === 'running' ? new Date(c.endTime) : new Date(c.startTime);
        const diff = target - now;
        if (diff > 0) {
          const d = Math.floor(diff / 86400000);
          const h = Math.floor((diff % 86400000) / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          updated[c._id] = d > 0 ? `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        } else {
          updated[c._id] = 'Started';
        }
      });
      setTimers(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [upcomingContests, runningContests]);

  const loadContests = async () => {
    try {
      const [upcoming, running, past] = await Promise.all([
        getUpcomingContests(), getRunningContests(), getPastContests()
      ]);
      setUpcomingContests(upcoming || []);
      setRunningContests(running || []);
      setPastContests(past || []);
    } catch (error) {
      console.error('Failed to load contests:', error);
      toast.error('Failed to load contests');
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
  };

  
  const FeaturedCard = ({ contest, index, isLive }) => {
    const isWeekly = contest.type === 'weekly';
    
    const gradients = [
      { bg: 'from-amber-400 via-orange-400 to-amber-500', accent: 'bg-amber-500/90', text: 'text-amber-900' },
      { bg: 'from-violet-500 via-purple-500 to-indigo-500', accent: 'bg-purple-600/90', text: 'text-purple-100' },
      { bg: 'from-emerald-400 via-teal-400 to-cyan-500', accent: 'bg-emerald-500/90', text: 'text-emerald-900' },
      { bg: 'from-rose-400 via-pink-400 to-fuchsia-500', accent: 'bg-rose-500/90', text: 'text-rose-100' },
    ];
    const theme = gradients[index % gradients.length];

    return (
      <div
        className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
        onClick={() => navigate(`/contests/${contest._id}`)}
        style={{ minHeight: 220 }}
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-90`} />

        {/* Decorative circles (LeetCode-style) */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-16 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute left-8 -bottom-6 w-20 h-20 rounded-full bg-white/5" />

        {/* Floating 3D cube effect */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-50 transition">
          <div className="w-24 h-24 border-2 border-white/40 rounded-xl rotate-12 group-hover:rotate-6 transition-transform duration-500" />
          <div className="w-16 h-16 border-2 border-white/30 rounded-lg -rotate-6 absolute top-4 left-4 group-hover:rotate-3 transition-transform duration-500" />
        </div>

      {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          {/* Timer Badge */}
          <div className="flex justify-end">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-black/20 text-white backdrop-blur-sm'}`}>
              {isLive && <span className="w-2 h-2 bg-white rounded-full animate-ping" />}
              <Clock className="w-3.5 h-3.5" />
              <span>{isLive ? 'Ends in ' : ''}{timers[contest._id] || '...'}</span>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-auto">
            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-sm">
              {contest.title}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-white/80 text-sm">
                {formatDate(contest.startTime)}
              </p>
              <div className="flex items-center gap-2">
                {isLive ? (
                  <button
                    className="px-4 py-1.5 rounded-full bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 transition shadow-lg"
                    onClick={(e) => { e.stopPropagation(); navigate(`/contests/${contest._id}/live`); }}
                  >
                    Enter Contest →
                  </button>
                ) : (
                  <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-sm" title="Set reminder" onClick={(e) => { e.stopPropagation(); toast.success('Reminder set!'); }}>
                    <Bell className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Past Contest Row ───
  const PastRow = ({ contest, idx }) => (
    <div
      onClick={() => navigate(`/contests/${contest._id}`)}
      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-dark-800/50 cursor-pointer transition group border-b border-gray-100 dark:border-dark-800 last:border-0"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-700 dark:to-dark-600 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition truncate">
            {contest.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {new Date(contest.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <div className="text-xs text-gray-500 dark:text-gray-500">Participants</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{contest.totalParticipants || 0}</div>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs text-gray-500 dark:text-gray-500">Problems</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{contest.problems?.length || 0}</div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          contest.type === 'weekly' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' :
          contest.type === 'biweekly' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' :
          'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
        }`}>
          {contest.type}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition" />
      </div>
    </div>
  );

  const allFeatured = [...runningContests, ...upcomingContests];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Contests</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero Section — Trophy + Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-lg shadow-amber-300/30 mb-5">
            <Trophy className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            CodeBattle Contest
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            Contest every week. Compete and see your ranking!
          </p>
        </div>

        {/* Featured Cards (Upcoming + Running) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {[0,1].map(i => (
              <div key={i} className="h-56 rounded-2xl bg-gray-200 dark:bg-dark-800 animate-pulse" />
            ))}
          </div>
        ) : allFeatured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {allFeatured.map((c, i) => (
              <FeaturedCard key={c._id} contest={c} index={i} isLive={c.status === 'running'} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-10 bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-800">
            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No upcoming contests</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Check back later for new contests</p>
          </div>
        )}

        {/* Past Contests Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              Past Contests
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{pastContests.length} contests</span>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-dark-800 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-dark-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : pastContests.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800">
              <p className="text-gray-500 dark:text-gray-400">No past contests yet</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-800 overflow-hidden">
              {pastContests.map((c, i) => (
                <PastRow key={c._id} contest={c} idx={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}